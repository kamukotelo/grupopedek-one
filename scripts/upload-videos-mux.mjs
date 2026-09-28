#!/usr/bin/env node
// Carrega os vídeos do site para o Mux e grava os playback IDs em src/data/muxPlaybackIds.json.
//
// Uso:
//   MUX_TOKEN_ID=... MUX_TOKEN_SECRET=... node scripts/upload-videos-mux.mjs [--force] [id ...]
//
// Por omissão só carrega vídeos que ainda não têm playback ID; --force volta a carregar.
// A fonte é o MP4 web em public/videos/. Para melhor qualidade no Mux, pode apontar-se
// um original com --source <id>=<caminho>, p.ex. --source viaturas-preparadas=work/videos-originais/IMG_1872.MOV

import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const idsFile = resolve(root, 'src/data/muxPlaybackIds.json');
const catalogFile = resolve(root, 'src/data/siteVideos.ts');

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error('Faltam MUX_TOKEN_ID e MUX_TOKEN_SECRET (Mux Dashboard → Settings → Access Tokens, permissão Mux Video: Read + Write).');
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const sourceOverrides = {};
const only = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--force') continue;
  if (args[i] === '--source') {
    const [id, path] = args[++i].split('=');
    sourceOverrides[id] = resolve(root, path);
  } else only.push(args[i]);
}

// Lê os MP4 locais do catálogo, para haver uma só lista de vídeos.
const catalog = await readFile(catalogFile, 'utf8');
const localBlock = catalog.slice(catalog.indexOf('LOCAL_SOURCES'), catalog.indexOf('};', catalog.indexOf('LOCAL_SOURCES')));
const videos = [...localBlock.matchAll(/'([^']+)':\s*'([^']+)'/g)].map(([, id, src]) => ({ id, file: sourceOverrides[id] ?? resolve(root, 'public', src.replace(/^\//, '')) }));

const playbackIds = JSON.parse(await readFile(idsFile, 'utf8'));
const auth = 'Basic ' + Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Repete pedidos que falham por rede (DNS, ligação cortada), comuns em redes instáveis.
async function fetchWithRetry(url, init, attempts = 5) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      if (attempt >= attempts) throw error;
      const wait = attempt * 3000;
      console.warn(`  rede falhou (${error.cause?.code ?? error.message}); nova tentativa ${attempt + 1}/${attempts} em ${wait / 1000}s…`);
      await sleep(wait);
    }
  }
}

async function mux(path, init = {}) {
  const response = await fetchWithRetry(`https://api.mux.com${path}`, {
    ...init,
    headers: { Authorization: auth, 'Content-Type': 'application/json', ...init.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Mux ${init.method ?? 'GET'} ${path} → ${response.status}: ${JSON.stringify(body.error ?? body)}`);
  return body.data;
}

async function upload({ id, file }) {
  const { size } = await stat(file);
  console.log(`↑ ${id} (${(size / 1e6).toFixed(1)} MB)`);
  const created = await mux('/video/v1/uploads', {
    method: 'POST',
    body: JSON.stringify({
      cors_origin: '*',
      new_asset_settings: { playback_policy: ['public'], video_quality: 'basic', passthrough: id },
    }),
  });
  const put = await fetchWithRetry(created.url, { method: 'PUT', body: await readFile(file) });
  if (!put.ok) throw new Error(`Falhou o envio de ${id}: ${put.status}`);

  let assetId;
  for (let tries = 0; !assetId; tries++) {
    if (tries > 60) throw new Error(`Mux não criou o asset de ${id}`);
    await sleep(2000);
    const status = await mux(`/video/v1/uploads/${created.id}`);
    if (status.status === 'errored') throw new Error(`Upload de ${id} falhou: ${JSON.stringify(status.error)}`);
    assetId = status.asset_id;
  }

  for (let tries = 0; ; tries++) {
    if (tries > 150) throw new Error(`O asset ${assetId} (${id}) não ficou pronto a tempo`);
    const asset = await mux(`/video/v1/assets/${assetId}`);
    if (asset.status === 'errored') throw new Error(`Mux não processou ${id}: ${JSON.stringify(asset.errors)}`);
    if (asset.status === 'ready') {
      const playbackId = asset.playback_ids?.find((p) => p.policy === 'public')?.id;
      if (!playbackId) throw new Error(`Asset ${assetId} (${id}) sem playback ID público`);
      return playbackId;
    }
    await sleep(4000);
  }
}

const pending = videos.filter((v) => (only.length === 0 || only.includes(v.id)) && (force || !playbackIds[v.id]));
if (pending.length === 0) console.log('Nada a carregar: todos os vídeos já têm playback ID (use --force para repetir).');

for (const video of pending) {
  playbackIds[video.id] = await upload(video);
  // Gravar a cada vídeo, para não se perder o progresso se um upload falhar.
  await writeFile(idsFile, JSON.stringify(playbackIds, null, 2) + '\n');
  console.log(`✓ ${video.id} → ${playbackIds[video.id]}`);
}
