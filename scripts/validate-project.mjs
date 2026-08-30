import fs from 'node:fs';
import crypto from 'node:crypto';

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
expect(ids.length === 51, `Esperadas 51 viaturas; encontradas ${ids.length}`);
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
expect(flyerFolders.length === 51, `Esperadas 51 pastas da frota dos flyers; encontradas ${flyerFolders.length}`);
for (const folder of flyerFolders) {
  expect(fs.existsSync(`public/fleet-flyer-2026/${folder.name}/01-oficial.webp`), `Imagem oficial ausente: ${folder.name}`);
}

// Page 7 of the Full Day 2026 PDF previously had a shifted image assignment.
// Lock the corrected exports so the vehicle names cannot silently drift again.
const correctedFlyerImageHashes = {
  'hyundai-staria-atual': 'd75d3bf6429c96c8aaa7ff48e9a5b3e5621d38d4ddbbcd362a05be5fb95d1e93',
  'nova-toyota-hiace': '8fa9463e8311c4c2d71cdce4e229805b34c1392f7b80aacf4a108d2a3bbc25a7',
  'mercedes-sprinter-atual': '5cdfecdc0d1a1215429b0a6024822d5d3259155bef341e7c4fa652666a522777',
  'nissan-patrol': '6d7a0e6547d40b1b456279533ada45e1e558a5db8878573b83e57efb28581492',
  'novo-toyota-prado': 'ed4e8e693ea827d7308704ff36b6ffca09ddfb25980034009e6ea647a0bc147c',
};
for (const [folder, expectedHash] of Object.entries(correctedFlyerImageHashes)) {
  const path = `public/fleet-flyer-2026/${folder}/01-oficial.webp`;
  const actualHash = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
  expect(actualHash === expectedHash, `Imagem oficial incoerente com o catálogo PDF: ${folder}`);
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
expect(servicesSource.includes('6000'), 'O carrossel de Serviços não está configurado para rotação automática');
const heroSource = fs.readFileSync('src/components/sections/Hero.tsx', 'utf8');
expect(heroSource.includes('6000') && heroSource.includes('prefers-reduced-motion'), 'O carrossel principal não possui rotação automática e acessível');
const gallerySource = fs.readFileSync('src/components/fleet/VehicleGalleryModal.tsx', 'utf8');
expect(gallerySource.includes('setInterval') && gallerySource.includes('6000'), 'A galeria de viaturas não possui rotação automática');
const fleetShowcaseSource = fs.readFileSync('src/components/sections/FleetShowcase.tsx', 'utf8');
expect(fleetShowcaseSource.includes('setInterval') && fleetShowcaseSource.includes('6000') && fleetShowcaseSource.includes('prefers-reduced-motion'), 'A vitrine de frota não possui rotação automática acessível');

const languageSource = fs.readFileSync('src/components/ui/LanguageSwitcher.tsx', 'utf8');
for (const flag of ['🇦🇴', '🇬🇧', '🇫🇷']) {
  expect(languageSource.includes(flag), `Bandeira de idioma ausente: ${flag}`);
}

const paymentSource = fs.readFileSync('src/components/portal/PaymentSimulatorModal.tsx', 'utf8');
expect(paymentSource.includes('Ambiente de demonstração'), 'Pagamento demo não está identificado como simulação');
expect(paymentSource.includes('Multicaixa Express'), 'Canal Angola Multicaixa ausente');
expect(paymentSource.includes('MB WAY') && paymentSource.includes('Portugal'), 'Canal Portugal MB WAY ausente');
expect(paymentSource.includes('não recolhe nem armazena o número do seu cartão'), 'O fluxo não informa a política de dados de cartão');
expect(!paymentSource.includes('cardNumber') && !paymentSource.includes('phoneNumber'), 'O frontend ainda recolhe dados bancários sensíveis');
const paymentApiSource = fs.readFileSync('api/payments-create.js', 'utf8');
expect(paymentApiSource.includes('idempotencyKey') && paymentApiSource.includes('invoice.amount_aoa'), 'A API de pagamentos não valida idempotência e valor no servidor');
expect(paymentApiSource.includes('invoice.amount_eur') && paymentApiSource.includes('invoice.amount_usd'), 'Os montantes EUR e USD não são validados separadamente no servidor');
const stripeWebhookSource = fs.readFileSync('api/payments-webhook-stripe.js', 'utf8');
expect(stripeWebhookSource.includes('verifyStripeSignature') && stripeWebhookSource.includes("status: 'paid'"), 'A liquidação Stripe não depende de webhook assinado');
const reconciliationSource = fs.readFileSync('api/payments-reconcile.js', 'utf8');
expect(reconciliationSource.includes('FINANCE_ROLES') && reconciliationSource.includes("order.provider === 'stripe'"), 'A reconciliação bancária não está restrita ou pode substituir o webhook Stripe');
expect(fs.readFileSync('supabase/schema.sql', 'utf8').includes('CREATE TABLE IF NOT EXISTS public.payment_events'), 'A trilha de auditoria de pagamentos está ausente');

const demoUsersSource = fs.readFileSync('src/data/demoUsers.ts', 'utf8');
const demoUserIds = [...demoUsersSource.matchAll(/id:\s*'demo_[^']+'/g)];
expect(demoUserIds.length === 9, `Esperados 9 utilizadores demo; encontrados ${demoUserIds.length}`);
expect(!demoUsersSource.includes('DEMO_PASSWORD'), 'Existe uma senha de demonstração hardcoded no frontend');
expect(!demoUsersSource.includes('DEMO_LOGIN_ROLES'), 'Existem credenciais de demonstração no frontend');
const clientAreaSource = fs.readFileSync('src/components/ui/ClientAreaModal.tsx', 'utf8');
expect(clientAreaSource.includes('loginAs(profile.role)'), 'Os perfis demo não possuem acesso direto sem senha');
expect(clientAreaSource.includes('isDemoMode &&'), 'Os perfis demo não estão isolados por ambiente');
expect(clientAreaSource.includes('Conta Corporativa') && clientAreaSource.includes('Cliente Particular'), 'Os acessos corporativo e particular não estão separados');
const authSource = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');
expect(authSource.includes('if (!IS_DEMO_MODE) return;'), 'loginAs não está bloqueado fora do modo demo');
expect(demoUsersSource.includes('DEMO_OPERATIONAL_RECORDS'), 'Agenda operacional demonstrativa ausente');
expect(demoUsersSource.includes('DEMO_ODOO_EVENTS'), 'Eventos demonstrativos Odoo ausentes');
expect(demoUsersSource.includes('totalVehiclesSynced: 51'), 'Frota oficial não está representada no estado Odoo demo');

const securitySource = fs.readFileSync('api/_security.js', 'utf8');
expect(securitySource.includes('takeRateLimit') && securitySource.includes('applyApiSecurity'), 'Proteções comuns dos endpoints estão ausentes');
const reservationApiSource = fs.readFileSync('api/reservations.js', 'utf8');
expect(reservationApiSource.includes('SUPABASE_SERVICE_ROLE_KEY') && !reservationApiSource.includes('VITE_SUPABASE_ANON_KEY'), 'Reservas não estão restritas à credencial do servidor');
const schemaSource = fs.readFileSync('supabase/schema.sql', 'utf8');
expect(schemaSource.includes('REVOKE ALL ON public.bookings FROM anon'), 'A escrita anónima em reservas não foi revogada');
expect(schemaSource.includes('Finance roles read all invoices'), 'O filtro RLS para perfis financeiros está ausente');
expect(schemaSource.includes('Fleet roles read all assignments'), 'O filtro RLS para responsáveis de frota está ausente');
const permissionSource = fs.readFileSync('src/lib/portalPermissions.ts', 'utf8');
expect(permissionSource.includes('Record<UserRole, PortalPermissions>'), 'A matriz central de permissões do portal está ausente');
expect(permissionSource.includes('motorista: { fleet: true, finances: false, operations: false, odoo: false'), 'O perfil de motorista possui permissões excessivas');

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
