import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE = await fs.readFile(path.join(ROOT, 'src/data/fleetData.ts'), 'utf8');
const OUTPUT = path.join(ROOT, 'public/fleet-carousel');
const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'PEPEK-Fleet-Catalog/1.0 (website asset curation)';
const START_INDEX = Number(process.env.START_INDEX ?? 0);
const ONLY_ID = process.env.ONLY_ID ?? '';

const vehiclePattern = /\{\s*\n\s*id: '([^']+)',[\s\S]*?\n\s*name: '([^']+)',\s*\n\s*brand: '([^']+)',\s*\n\s*model: '([^']+)',\s*\n\s*year: '([^']+)'/g;
const vehicles = [...SOURCE.matchAll(vehiclePattern)].map((match) => ({
  id: match[1], name: match[2], brand: match[3], model: match[4], year: match[5]
}));

if (vehicles.length !== 47) throw new Error(`Esperadas 47 viaturas; encontradas ${vehicles.length}`);

const clean = (value) => value
  .replace(/\b(Executiva|Executive|VIP|Luxury|Ultimate|Smart|Presidential|Stretch|Novo|Nova|Modelo|Clássica|Atual)\b/gi, ' ')
  .replace(/\b(\d+L|\d+P)\b/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const specialQueries = {
  'rangerover-blindado-2025': 'Range Rover L460',
  'range-rover-novo-modelo': 'Range Rover L460 Autobiography',
  'mercedes-class-s-2025': 'Mercedes-Benz W223 S-Class',
  'mercedes-g63-2023': 'Mercedes-Benz G-Class',
  'mercedes-g63': 'Mercedes-Benz G-Class',
  'mercedes-vito': 'Mercedes-Benz Vito Tourer',
  'lexus-600': 'Lexus LX 600',
  'lexus-570': 'Lexus LX 570',
  'toyota-lc300-2023': 'Toyota Land Cruiser 300',
  'toyota-lc-v8-2021': 'Toyota Land Cruiser 200',
  'mercedes-cls63': 'Mercedes-Benz CLS 63 AMG',
  'mercedes-brabus': 'Brabus Mercedes',
  'volvo-xc-60': 'Volvo XC60 2022',
  'new-toyota-prado': 'Toyota Land Cruiser 250',
  'nissan-patrol': 'Nissan Patrol Y63',
  'toyota-prado-atual': 'Toyota Land Cruiser Prado J150',
  'toyota-fortuner-atual': 'Toyota Fortuner',
  'toyota-fortuner-2023': 'Toyota Fortuner',
  'mercedes-benz-v300-class': 'Mercedes-Benz V-Class W447',
  'hyundai-staria-executiva': 'Hyundai Staria Lounge',
  'hyundai-staria-atual': 'Hyundai Staria',
  'toyota-coaster': 'Toyota Coaster',
  'mercedes-sprinter-atual': 'Mercedes-Benz Sprinter',
  'new-toyota-hiace': 'Toyota HiAce H300',
  'toyota-hiace': 'Toyota HiAce',
  'hyundai-h1': 'Hyundai H-1',
  'jetour-x70': 'Jetour X70 Plus',
  'hyundai-santa-fe': 'Hyundai Santa Fe MX5',
  'hyundai-tucson': 'Hyundai Tucson NX4',
  'chery-tiggo-7': 'Chery Tiggo 7 Pro',
  'chery-tiggo-2': 'Chery Tiggo 2 Pro',
  'hyundai-creta': 'Hyundai Creta',
  'toyota-lc-hz': 'Toyota Land Cruiser 79',
  'toyota-lc-hz-18p': 'Toyota Land Cruiser 78 Troop Carrier',
  'mitsubishi-canter': 'Mitsubishi Fuso Canter',
  'mitsubishi-l200': 'Mitsubishi L200 Triton',
  'toyota-hilux': 'Toyota Hilux GR Sport',
  'suzuki-swift': 'Suzuki Swift 2024',
  'suzuki-baleno': 'Suzuki Baleno 2022',
  'hyundai-i-20': 'Hyundai i20 BC3',
  'suzuki-spresso': 'Suzuki S-Presso',
  'toyota-starlet': 'Toyota Starlet Cross',
  'hyundai-g-i10': 'Hyundai Grand i10 sedan',
  'kia-morning': 'Kia Picanto JA',
  'suzuki-celerio': 'Suzuki Celerio 2021',
  'limousine': 'Lincoln Town Car stretch limousine'
};

async function commonsSearch(query, limit = 30) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6', gsrlimit: String(limit),
    prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: '1400'
  });
  const response = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Commons ${response.status}: ${query}`);
  const data = await response.json();
  return Object.values(data.query?.pages ?? {}).map((page) => ({ page, info: page.imageinfo?.[0] })).filter(({ info }) => info);
}

function scoreCandidate(candidate, query, angle) {
  const info = candidate.info;
  const title = candidate.page.title.toLowerCase();
  const tokens = query.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
  let score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 4 : 0), 0);
  if (angle !== 'exterior' && title.includes(angle)) score += 6;
  if (/front|frontal|rear|back|side|interior|dashboard|cockpit|salon|cabin/.test(title)) score += 2;
  if (/logo|badge|emblem|engine|wheel|taxi|police|wreck|accident|drawing|diagram|toy|model car/.test(title)) score -= 12;
  if ((info.width ?? 0) >= 1600) score += 3;
  if ((info.height ?? 0) >= 900) score += 2;
  return score;
}

function extensionFor(mime) {
  return mime === 'image/png' ? 'png' : 'jpg';
}

async function download(url, destination) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Referer: 'https://commons.wikimedia.org/' } });
    if (response.ok) {
      const data = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(destination, data);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return data.length;
    }
    if (response.status !== 429 || attempt === 5) throw new Error(`Download ${response.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 2500));
  }
}

await fs.mkdir(OUTPUT, { recursive: true });
const manifest = { generatedAt: new Date().toISOString(), source: 'Wikimedia Commons', vehicles: {} };
const generated = ['/* Gerado por scripts/download-fleet-carousel.mjs. */', "import type { VehicleDetail } from './fleetData';", '', "export type FleetGalleryImage = VehicleDetail['gallery'][number];", '', 'export const FLEET_CAROUSEL: Record<string, FleetGalleryImage[]> = {'];

for (const [vehicleIndex, vehicle] of vehicles.entries()) {
  if (vehicleIndex < START_INDEX) continue;
  if (ONLY_ID && vehicle.id !== ONLY_ID) continue;
  const query = specialQueries[vehicle.id] ?? clean(`${vehicle.brand} ${vehicle.model}`);
  const angles = ['exterior', 'front', 'rear', 'interior'];
  const all = [];
  for (const angle of angles) {
    const suffix = angle === 'exterior' ? '' : ` ${angle}`;
    try {
      const results = await commonsSearch(`${query}${suffix}`);
      all.push(...results.map((candidate) => ({ ...candidate, angle, score: scoreCandidate(candidate, query, angle) })));
    } catch (error) {
      process.stderr.write(`${vehicle.id}: ${error.message}\n`);
    }
  }

  const used = new Set();
  const selected = all
    .sort((a, b) => b.score - a.score)
    .filter(({ page, info }) => {
      const key = info.descriptionurl || page.title;
      if (used.has(key) || !['image/jpeg', 'image/png'].includes(info.mime)) return false;
      if ((info.width ?? 0) < 1000 || (info.height ?? 0) < 600) return false;
      used.add(key);
      return true;
    })
    .slice(0, 4);

  if (selected.length < 3) throw new Error(`${vehicle.id}: apenas ${selected.length} imagens adequadas encontradas`);
  const vehicleDir = path.join(OUTPUT, vehicle.id);
  await fs.mkdir(vehicleDir, { recursive: true });
  const entries = [];
  for (const [index, candidate] of selected.entries()) {
    const ext = extensionFor(candidate.info.mime);
    const filename = `${String(index + 1).padStart(2, '0')}-${candidate.angle}.${ext}`;
    const destination = path.join(vehicleDir, filename);
    const bytes = await download(candidate.info.thumburl || candidate.info.url, destination);
    const meta = candidate.info.extmetadata ?? {};
    entries.push({
      file: `/fleet-carousel/${vehicle.id}/${filename}`,
      angle: candidate.angle,
      title: candidate.page.title.replace(/^File:/, ''),
      sourcePage: candidate.info.descriptionurl,
      originalUrl: candidate.info.url,
      author: meta.Artist?.value ?? 'Consultar página de origem',
      license: meta.LicenseShortName?.value ?? meta.UsageTerms?.value ?? 'Consultar página de origem',
      licenseUrl: meta.LicenseUrl?.value ?? null,
      width: candidate.info.width,
      height: candidate.info.height,
      downloadedBytes: bytes
    });
  }
  manifest.vehicles[vehicle.id] = { name: vehicle.name, query, images: entries };
  generated.push(`  '${vehicle.id}': [`);
  for (const [index, entry] of entries.entries()) {
    const label = ['Vista exterior', 'Vista frontal', 'Vista traseira', 'Interior e detalhes'][index] ?? 'Detalhe';
    generated.push(`    { url: '${entry.file}', caption: '${label} — ${vehicle.name.replaceAll("'", "\\'")}', altText: '${vehicle.name.replaceAll("'", "\\'")} — ${label.toLowerCase()}', type: '${index === 3 ? 'interior' : index === 1 ? 'exterior_front' : 'exterior_side'}' },`);
  }
  generated.push('  ],');
  process.stdout.write(`[${vehicleIndex + 1}/47] ${vehicle.name}: ${entries.length} imagens\n`);
}

generated.push('};', '');
  await fs.writeFile(path.join(OUTPUT, `manifest-part-${START_INDEX}.json`), JSON.stringify(manifest, null, 2));
await fs.writeFile(path.join(ROOT, 'src/data/fleetGallery.generated.ts'), `${generated.join('\n')}\n`);
console.log(`Concluído o lote iniciado em ${START_INDEX + 1}.`);
