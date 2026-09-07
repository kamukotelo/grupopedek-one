// Read-only public-source discovery. Does not alter site components or assets.
import fs from 'node:fs/promises';
import path from 'node:path';
const out = '/tmp/pepek-client-logo-research';
await fs.mkdir(out, { recursive: true });
const sources = [
  ['sonangol','https://www.sonangol.co.ao/marca-sonangol/'],
  ['totalenergies','https://totalenergies.pt/sobre-nos/identidade-e-historia-da-marca-totalenergies'],
  ['unitel','https://www.unitel.ao/'],
  ['bai','https://www.bancobai.ao/'],
  ['governo','https://www.governo.gov.ao/'],
  ['fgc','https://www.fgc.gov.ao/'],
  ['embassy','https://ao.usembassy.gov/'],
  ['assembleia','https://www.parlamento.ao/index.html'],
  ['anpg','https://anpg.co.ao/sobre-nos/'],
  ['taag','https://flytaag.com/pt/'],
  ['bfa','https://www.bfa.ao/pt/'],
  ['atlantico','https://www.atlantico.ao/pt/institucional/o-atlantico/atlantico'],
  ['standard','https://www.standardbank.co.ao/'],
  ['unicef','https://www.unicef.org/angola/'],
  ['fidelidade','https://www.fidelidade.co.ao/'],
  ['dstv','https://www.dstv.com/pt-ao/'],
  ['zap','https://www.zap.co.ao/'],
  ['catoca','https://www.catoca.com/'],
  ['globo','https://redeglobo.globo.com/'],
  ['cnn','https://www.cnnbrasil.com.br/'],
  ['sic','https://sic.gov.ao/'],
  ['elisal','https://www.elisal.ao/'],
  ['cosmos','https://cosmos-viagens.co.ao/'],
  ['faf','https://faf.co.ao/'],
  ['dw','https://corporate.dw.com/en/about-dw/s-30688'],
];
const followup = [
 ['unitel-careers','https://oportunidadesdecarreira.unitel.ao/content/Trabalhar-na-Unitel/?locale=pt_PT'],
 ['unicef-history','https://www.unicef.org/about-unicef/unicef-logo-history'],
 ['faf-minjud','https://minjud.gov.ao/web/seccoes/federacao-e-associacoes'],
 ['dw-amp','https://amp.dw.com/es/a%C3%B1o-nuevo/a-75326664'],
 ['assembleia-js','https://www.parlamento.ao/assets/index-DzS3Ub6u.js'],
 ['dstv-js','https://www.dstv.com/content/menu-v2/main.89ae7456a25633eb.js'],
 ['zap-js','https://www.zap.co.ao/_nuxt/18f76f7.js'],
 ['unitel-css','https://rmkcdn.successfactors.com/b9ea9e0e/385aa8c5-e876-4044-8d74-a.css'],
];
const results = [];
async function inspect([id, url]) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(22000) });
    const html = await r.text();
    await fs.writeFile(path.join(out, `${id}.html`), html);
    const tags = [...html.matchAll(/<(?:img|source|link)[\s\S]*?>/gi)].map(m=>m[0]);
    const candidates = tags.filter(t=>/logo|brand|sonangol|unicef|faf/i.test(t)).map(t=>t.slice(0,700));
    if (id.endsWith('-js')) candidates.push(...[...html.matchAll(/.{0,60}(?:logo|Logo).{0,120}/g)].slice(0,16).map(m=>m[0]));
    if (id.endsWith('-css')) candidates.push(...[...html.matchAll(/url\([^)]*\)/g)].map(m=>m[0]).slice(0,30));
    const entry={id,url:r.url,status:r.status,candidates:candidates.slice(0,22)};
    results.push(entry); console.log(JSON.stringify(entry));
  } catch(e) { results.push({id,url,error:e.message}); console.log(JSON.stringify({id,error:e.message})); }
}
const list = process.argv.includes('--followup') ? followup : sources;
for (let i=0;i<list.length;i+=5) await Promise.all(list.slice(i,i+5).map(inspect));
await fs.writeFile(path.join(out,'sources.json'),JSON.stringify(results,null,2));
