#!/usr/bin/env node
/**
 * Gera `api/_fleet-catalog.js` a partir da fonte única `FLYER_FLEET_2026`.
 * O endpoint `api/ai.js` (chatbot "Consultor Pepek") usa este catálogo para
 * responder com nomes, lugares, câmbio, combustível e preços REAIS — sem
 * alucinar. Regenerar sempre que a frota mudar:  npm run gen:ai
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createJiti } from 'jiti';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const jiti = createJiti(root, { interopDefault: true });

const { FLYER_FLEET_2026 } = await jiti.import('./src/data/fleetFlyer2026.ts');

const catalog = FLYER_FLEET_2026.map((v) => ({
  id: v.id,
  name: v.name,
  category: v.category,
  categoryLabel: v.categoryLabel,
  seats: v.specs?.passengers ?? null,
  doors: v.specs?.doors ?? null,
  transmission: v.specs?.transmission ?? '',
  fuel: v.specs?.fuelType ?? '',
  pricePerDay: v.pricePerDayFormatted?.replace(/\s*Kz$/, '') ?? '',
  transferPrice: v.transferPriceFormatted?.replace(/\s*Kz$/, '') ?? '',
}));

const body = catalog
  .map((v) => '  ' + JSON.stringify(v))
  .join(',\n');

const out = `// GERADO por scripts/gen-ai-knowledge.mjs — NÃO editar à mão.
// Fonte: src/data/fleetFlyer2026.ts (FLYER_FLEET_2026). Regenerar: npm run gen:ai
export const FLEET_CATALOG = [
${body},
];
`;

const target = resolve(root, 'api/_fleet-catalog.js');
writeFileSync(target, out);
console.log(`api/_fleet-catalog.js — ${catalog.length} viaturas`);
