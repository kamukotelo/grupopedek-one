import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = await fs.readFile(path.join(root, 'src/data/fleetData.ts'), 'utf8');
const output = path.join(root, 'public/fleet-carousel');
const pattern = /\{\s*\n\s*id: '([^']+)',[\s\S]*?\n\s*name: '([^']+)'/g;
const vehicles = [...source.matchAll(pattern)].map((match) => ({ id: match[1], name: match[2] }));

if (vehicles.length !== 47) throw new Error(`Esperadas 47 viaturas; encontradas ${vehicles.length}`);

const lines = [
  '/* Gerado automaticamente. Não editar manualmente. */',
  "import type { VehicleDetail } from './fleetData';",
  '',
  "export type FleetGalleryImage = VehicleDetail['gallery'][number];",
  '',
  'export const FLEET_CAROUSEL: Record<string, FleetGalleryImage[]> = {'
];
const manifest = { generatedAt: new Date().toISOString(), source: 'Wikimedia Commons; detalhes disponíveis nos manifest-part quando capturados', vehicles: {} };

for (const vehicle of vehicles) {
  const directory = path.join(output, vehicle.id);
  const files = (await fs.readdir(directory)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort();
  // Uma pasta pode ficar vazia após a auditoria; nesses casos o site usa a
  // fotografia original da própria ficha, sem recorrer a imagens erradas.
  lines.push(`  '${vehicle.id}': [`);
  const images = [];
  for (const [index, file] of files.entries()) {
    const labels = ['Vista exterior', 'Vista frontal', 'Vista traseira', 'Interior e detalhes'];
    const label = labels[index] ?? `Detalhe ${index + 1}`;
    const url = `/fleet-carousel/${vehicle.id}/${file}`;
    const escapedName = vehicle.name.replaceAll("'", "\\'");
    const type = index === 3 ? 'interior' : index === 1 ? 'exterior_front' : 'exterior_side';
    lines.push(`    { url: '${url}', caption: '${label} — ${escapedName}', altText: '${escapedName} — ${label.toLowerCase()}', type: '${type}' },`);
    images.push({ file: url, label });
  }
  lines.push('  ],');
  manifest.vehicles[vehicle.id] = { name: vehicle.name, imageCount: files.length, images, reviewStatus: files.length ? 'curated' : 'fallback_to_original' };
}

lines.push('};', '');
await fs.writeFile(path.join(root, 'src/data/fleetGallery.generated.ts'), `${lines.join('\n')}\n`);
await fs.writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Índice criado: ${vehicles.length} viaturas.`);
