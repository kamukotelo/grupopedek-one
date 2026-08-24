import fs from 'node:fs';

const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

for (const language of ['pt', 'en', 'fr']) {
  const path = `src/i18n/locales/${language}.json`;
  try { JSON.parse(fs.readFileSync(path, 'utf8')); }
  catch { failures.push(`${path} não contém JSON válido`); }
}

const fleetSource = fs.readFileSync('src/data/fleetData.ts', 'utf8');
const ids = [...fleetSource.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const slugs = [...fleetSource.matchAll(/\bslug:\s*'([^']+)'/g)].map(match => match[1]);
expect(ids.length === 47, `Esperadas 47 viaturas; encontradas ${ids.length}`);
expect(new Set(ids).size === ids.length, 'Existem IDs de viatura duplicados');
expect(new Set(slugs).size === slugs.length, 'Existem slugs de viatura duplicados');

const transparentFleetImages = fs.readdirSync('public/rent_car_transparent').filter(name => name.endsWith('.webp'));
const hdFleetImages = fs.readdirSync('public/rent_car_hd').filter(name => name.endsWith('.webp'));
expect(hdFleetImages.length === transparentFleetImages.length, `Esperadas ${transparentFleetImages.length} imagens HD; encontradas ${hdFleetImages.length}`);
for (const image of transparentFleetImages) {
  expect(hdFleetImages.includes(image), `Versão HD ausente: ${image}`);
}

const flyerFleetSource = fs.readFileSync('src/data/fleetFlyer2026.ts', 'utf8');
const flyerFolders = fs.readdirSync('public/fleet-flyer-2026', { withFileTypes: true }).filter(entry => entry.isDirectory());
expect(flyerFolders.length === 46, `Esperadas 46 pastas da frota dos flyers; encontradas ${flyerFolders.length}`);
for (const folder of flyerFolders) {
  expect(fs.existsSync(`public/fleet-flyer-2026/${folder.name}/01-oficial.webp`), `Imagem oficial ausente: ${folder.name}`);
}
expect(flyerFleetSource.includes('export const PUBLIC_FLEET = FLYER_FLEET_2026'), 'A frota pública não aponta para os flyers oficiais');

for (const component of [
  'src/components/fleet/VehicleCard.tsx',
  'src/components/fleet/VehicleGalleryModal.tsx',
]) {
  expect(fs.readFileSync(component, 'utf8').includes('/rent_car_hd/'), `Componente sem imagens HD: ${component}`);
}

for (const component of ['src/components/sections/Hero.tsx', 'src/components/sections/Services.tsx', 'src/components/sections/BookingWidget.tsx', 'src/components/fleet/BookingWizardModal.tsx']) {
  expect(fs.readFileSync(component, 'utf8').includes('PUBLIC_FLEET'), `Componente não usa a frota pública dos flyers: ${component}`);
}

for (const path of ['api/reservations.js', 'api/availability.js', 'api/ai.js', 'api/odoo-status.js', 'api/odoo-sync.js']) {
  expect(fs.existsSync(path), `Endpoint obrigatório ausente: ${path}`);
}

const bookingSource = fs.readFileSync('src/components/sections/BookingWidget.tsx', 'utf8');
expect(!bookingSource.includes("from('reservations')"), 'BookingWidget ainda grava na tabela reservations');
expect(!fs.readFileSync('src/lib/ai.ts', 'utf8').includes('VITE_GEMINI_API_KEY'), 'Chave Gemini ainda é referenciada no frontend');

const servicesSource = fs.readFileSync('src/components/sections/Services.tsx', 'utf8');
expect(servicesSource.includes('PUBLIC_FLEET.map'), 'A vitrine de Serviços não percorre a frota oficial dos flyers');
expect(!servicesSource.includes('images.unsplash.com'), 'A vitrine de Serviços contém imagens genéricas');
expect(!servicesSource.includes('scrollIntoView'), 'O carrossel de Serviços pode provocar scroll vertical automático');
expect(servicesSource.includes('rail.scrollTo'), 'O carrossel de Serviços não possui deslocamento horizontal controlado');

const languageSource = fs.readFileSync('src/components/ui/LanguageSwitcher.tsx', 'utf8');
for (const flag of ['🇦🇴', '🇬🇧', '🇫🇷']) {
  expect(languageSource.includes(flag), `Bandeira de idioma ausente: ${flag}`);
}

const paymentSource = fs.readFileSync('src/components/portal/PaymentSimulatorModal.tsx', 'utf8');
expect(paymentSource.includes('Simulador de Pagamento'), 'Pagamento demo não está identificado como simulação');
expect(paymentSource.includes('Multicaixa Express'), 'Canal Angola Multicaixa ausente');
expect(paymentSource.includes('MB WAY / Portugal'), 'Canal Portugal MB WAY ausente');

const demoUsersSource = fs.readFileSync('src/data/demoUsers.ts', 'utf8');
const demoUserIds = [...demoUsersSource.matchAll(/id:\s*'demo_[^']+'/g)];
expect(demoUserIds.length === 9, `Esperados 9 utilizadores demo; encontrados ${demoUserIds.length}`);
const demoLoginIds = [...demoUsersSource.matchAll(/'[^']+\.demo':\s*'[^']+'/g)];
expect(demoLoginIds.length === 9, `Esperados 9 logins demo; encontrados ${demoLoginIds.length}`);
expect(demoUsersSource.includes("DEMO_PASSWORD = 'PepekDemo2026!'"), 'Senha comum de demonstração não está configurada');
const clientAreaSource = fs.readFileSync('src/components/ui/ClientAreaModal.tsx', 'utf8');
expect(clientAreaSource.includes('loginAs(profile.role)'), 'Os perfis demo não possuem acesso direto sem senha');
expect(clientAreaSource.includes('Já possui uma conta PEPEK?'), 'O login real não está separado dos perfis demonstrativos');
expect(demoUsersSource.includes('DEMO_OPERATIONAL_RECORDS'), 'Agenda operacional demonstrativa ausente');
expect(demoUsersSource.includes('DEMO_ODOO_EVENTS'), 'Eventos demonstrativos Odoo ausentes');
expect(demoUsersSource.includes('totalVehiclesSynced: 46'), 'Frota oficial não está representada no estado Odoo demo');

const reviewGallerySource = fs.readFileSync('scripts/generate-fleet-review-gallery.mjs', 'utf8');
expect(reviewGallerySource.includes("pepek-fleet-image-review-v2"), 'O catálogo de imagens não usa o fluxo seguro de revisão');
expect(reviewGallerySource.includes("current.rights && current.people && current.plates"), 'A aprovação não exige as três confirmações de segurança');
expect(reviewGallerySource.includes("Bloqueada: licença incompleta"), 'Imagens sem licença completa não estão bloqueadas');
expect(reviewGallerySource.includes("Portal oficial para pesquisa"), 'As fontes oficiais do Excel não aparecem no catálogo de pesquisa');

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join('\n'));
  process.exit(1);
}
console.log('Validação concluída: idiomas, frota, endpoints e integrações críticas estão consistentes.');
