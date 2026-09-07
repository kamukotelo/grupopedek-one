// Creates an isolated research deliverable; never writes to public/ or src/.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root = process.cwd();
const out = path.join(root, 'docs/revisao-logotipos-clientes-2026-09-02');
await fs.mkdir(path.join(out, 'assets'), { recursive: true });
const c = (id, name, current, source, asset, note = '', scope = 'active') => ({ id, name, current, source, asset, note, scope });
const clients = [
 c('sonangol','Sonangol','clients-color/sonangol.png','https://www.sonangol.co.ao/marca-sonangol/','https://www.sonangol.co.ao/wp-content/uploads/2022/06/Sonangol_Logo_Horizontal_Preto4_Footer-2.png','Versão horizontal publicada pela marca. Não é apresentada como um redesenho de 2026.'),
 c('totalenergies','TotalEnergies','clients-color/totalenergies.webp','https://totalenergies.pt/sobre-nos/identidade-e-historia-da-marca-totalenergies','https://totalenergies.pt/themes/custom/butterfly_theme/logo.svg?v=1.2','Identidade TotalEnergies de 2021, ainda utilizada na página oficial consultada.'),
 c('unitel','UNITEL','clients-color/unitel.svg','https://oportunidadesdecarreira.unitel.ao/content/Trabalhar-na-Unitel/?locale=pt_PT','https://rmkcdn.successfactors.com/b9ea9e0e/e89dfe73-78cb-4346-b929-1.png','Ficheiro do cabeçalho do portal oficial de recrutamento, servido pelo CDN SuccessFactors. Portal principal indisponível nesta consulta.'),
 c('bai','Banco BAI','clients-color/bai.svg','https://www.bancobai.ao/pt/particulares','https://www.bancobai.ao/media/2584/logo-bai.svg'),
 c('governo','Governo de Angola','clients-color/governo-angola.png','https://www.fgc.gov.ao/','https://www.fgc.gov.ao/assets/img/clients/logo-angola.png','Referência institucional publicada pelo FGC. Confirmar a composição a utilizar: Governo, República ou um ministério específico; o portal do Governo não respondeu.'),
 c('fgc','Fundo de Garantia de Crédito','clients-color/fgc.png','https://www.fgc.gov.ao/','https://www.fgc.gov.ao/assets/img/logotipo.png','FGC de Angola; não confundir com a entidade brasileira.'),
 c('embassy','Embaixada Americana','clients-color/embassy.png','https://ao.usembassy.gov/',null,'Pendente: o portal oficial recusou a consulta (403). Solicitar o ficheiro autorizado à Embaixada; não substituir por um selo genérico dos EUA.'),
 c('assembleia','Assembleia Nacional','clients-color/assembleia.png','https://www.parlamento.ao/index.html','https://www.parlamento.ao/assets/LogoAN-DN0I2iWj.jpeg','Imagem usada no cabeçalho da aplicação oficial.'),
 c('anpg','ANPG Petróleos','clients-color/anpg.png','https://anpg.co.ao/sobre-nos/','https://anpg.co.ao/wp-content/uploads/2021/04/ANPG_Logos_01_novo.png'),
 c('taag','TAAG Linhas Aéreas','clients-color/taag.png','https://flytaag.com/en/','https://flytaag.com/Portals/_default/Skins/TAAG/images/taag-logo.png'),
 c('bfa','Banco BFA','clients-color/bai.svg','https://www.bfa.ao/pt/','https://www.bfa.ao/images/logos/logo-mobile.svg','ATENÇÃO: o bloco ativo usa o ficheiro do BAI para o nome BFA. A opção à direita é do BFA. A correção ainda não foi aplicada.'),
 c('atlantico','Banco Atlântico','clients-color/atlantico-oficial.png','https://www.atlantico.ao/pt/institucional/o-atlantico/atlantico','https://www.atlantico.ao/media/h10df34n/0-logo-atlanticosvg.png'),
 c('standard','Standard Bank','clients-color/standard.png','https://www.standardbank.co.ao/angola/pt/particulares','https://www.standardbank.co.ao/file_source/assets/icons/header-full.svg','Versão de cabeçalho do portal angolano.'),
 c('unicef','UNICEF Angola','clients-color/unicef.png','https://www.unicef.org/about-unicef/unicef-logo-history','https://www.unicef.org/sites/default/files/styles/crop_thumbnail/public/UNICEF_logo_2016.png.webp?itok=KQ7_QZGJ','Referência global mais recente apresentada na história oficial da marca: 2016, com assinatura “for every child”. Pedir a versão portuguesa autorizada para Angola. A UNICEF exige autorização escrita para uso do nome e emblema.'),
 c('fidelidade','Fidelidade Seguros','clients-color/fidelidade.png','https://www.fidelidade.co.ao/ao/particulares/Paginas/default.aspx','https://www.fidelidade.co.ao/style%20library/FidelidadeBranding/img/header/logo.png'),
 c('dstv','DStv / MultiChoice','clients-color/dstv.png','https://www.dstv.com/pt-ao/','https://www.dstv.com/media/3wlduhgu/dstv_d_angola.svg','Marca DStv Angola, confirmada no cabeçalho carregado no navegador. MultiChoice é outra assinatura: decidir qual corresponde ao cliente contratual.'),
 c('zap','ZAP Angola','clients-color/zap.png','https://www.zap.co.ao/','https://www.zap.co.ao/images/logo.svg','Marca principal ZAP, não ZAP Fibra ou ZAP Cinemas.'),
 c('catoca','Catoca Diamantes','clients-color/catoca.png','https://www.catoca.com/','https://www.catoca.com/wp-content/uploads/2025/05/Logotipo-Catoca-scaled.png'),
 c('globo','Rede Globo / TV Globo','clients-color/globo.png','https://redeglobo.globo.com/','https://i.s3.glbimg.com/v1/AUTH_b58693ed41d04a39826739159bf600a0/internal_photos/bs/2022/w/g/qrTjLIROSrr29QCHNpIQ/whatsapp-image-2022-01-28-at-14.52.26.jpeg','Referência editorial da TV Globo encontrada no portal oficial. Não é um ficheiro mestre transparente; solicitar o kit de marca antes de publicar. Não confundir com Globo corporativa ou Globoplay.'),
 c('cnn','CNN Brasil','clients-color/cnn.png','https://www.cnnbrasil.com.br/','https://admin.cnnbrasil.com.br/wp-content/themes/master-theme/assets/img/log-cnn-brasil-transparent.svg'),
 c('sic','SIC Investigação Criminal','carrousel/SIC-ANGOOLA-150x78.webp','https://sic.gov.ao/','https://sic.gov.ao/wp-content/uploads/2021/08/SIC_Logo.svg','','legacy'),
 c('elisal','ELISAL','carrousel/ELISAL-150x78.webp','https://www.elisal.ao/','https://www.elisal.ao/wp-content/uploads/2023/02/logo-elisal.png','','legacy'),
 c('cosmos','COSMOS Viagens','carrousel/COSMO-150x78.webp','https://cosmos-viagens.co.ao/','https://cosmos-viagens.co.ao/site/imagens/logo_1.png','COSMOS Angola Travel; não confundir com outras empresas homónimas.','legacy'),
 c('hv','HV International','carrousel/HV-LOGO-1-150x78.webp',null,null,'Pendente: confirmar o nome completo ou o site. O ficheiro antigo não permite identificar a entidade. Nenhuma marca homónima foi assumida.','legacy'),
 c('faf','FAF Futebol','carrousel/FAFI-LOGO-150x78.webp','https://minjud.gov.ao/web/seccoes/federacao-e-associacoes','https://c2a.portais.gov.ao/uploads/thumbnail_Federacao_Angolana_de_Futebol_e5b61bf38f.png','Referência publicada pelo Ministério da Juventude e Desportos de Angola. Confirmar o ficheiro mestre diretamente com a FAF.','legacy'),
 c('dw','Deutsche Welle (DW)','carrousel/Dw-150x78.webp','https://amp.dw.com/es/a%C3%B1o-nuevo/a-75326664','inline:dw-header','Símbolo vetorial extraído sem redesenho do cabeçalho oficial da DW; não inclui a assinatura “Made for minds”.','legacy'),
];
async function collect(item) {
 const ext = path.extname(item.current);
 item.currentFile = `assets/${item.id}-atual${ext}`;
 await fs.copyFile(path.join(root, 'public', item.current), path.join(out, item.currentFile));
 item.checkedAt = '2026-09-02'; item.decision = 'pending';
 if (!item.asset) { item.status = 'pending-identification-or-source'; return; }
 try {
  let bytes, type;
  if (item.asset === 'inline:dw-header') {
   const html = await fs.readFile('/tmp/pepek-client-logo-research/dw-amp.html','utf8');
   const at = html.indexOf('<div class="logo-icon">');
   const svg = html.slice(at).match(/<svg[\s\S]*?<\/svg>/)?.[0];
   if(!svg) throw new Error('SVG oficial não encontrado');
   bytes = Buffer.from(svg); type = 'image/svg+xml'; item.asset = item.source + '#header-logo';
  } else {
   const r = await fetch(item.asset, {signal: AbortSignal.timeout(40000)});
   item.httpStatus = r.status;
   if (!r.ok) throw new Error(`HTTP ${r.status}`);
   type = r.headers.get('content-type')?.split(';')[0];
   bytes = Buffer.from(await r.arrayBuffer());
   if (!type?.startsWith('image/')) throw new Error(`Tipo inesperado: ${type}`);
  }
  const extensions = {'image/svg+xml':'.svg','image/png':'.png','image/webp':'.webp','image/jpeg':'.jpg','image/gif':'.gif'};
  if(!extensions[type]) throw new Error(`Formato não aceite: ${type}`);
  if (type === 'image/svg+xml' && /<script|<foreignObject|\bon[a-z]+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|javascript:)/i.test(bytes.toString())) throw new Error('SVG com conteúdo ativo ou dependência externa; revisão manual necessária');
  item.candidateFile = `assets/${item.id}-referencia${extensions[type]}`;
  await fs.writeFile(path.join(out,item.candidateFile),bytes);
  item.bytes = bytes.length; item.sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  item.status = ['governo','faf','unicef','globo'].includes(item.id) ? 'official-reference-confirm-master' : 'official-source-file';
  delete item.error;
 } catch (e) {item.status = 'source-found-download-pending'; item.error = e.message + (e.cause?.code ? ` (${e.cause.code})` : '');}
 console.log(item.id,item.status,item.error || item.bytes);
}
let list = clients;
if(process.argv.includes('--retry')) {
 list = JSON.parse(await fs.readFile(path.join(out,'fontes.json'),'utf8')).clients;
 for (const item of list) if(!item.candidateFile) {
  const current=clients.find(c=>c.id===item.id);
  item.asset=current.asset; item.note=current.note;
 }
}
const pending = list.filter(c=>!c.candidateFile && c.httpStatus!==403);
const globo = pending.find(c=>c.id==='globo');
if(globo) {
 const html = await fs.readFile('/tmp/pepek-client-logo-research/globo.html','utf8');
 const tag = [...html.matchAll(/<img[^>]+>/g)].find(m=>/alt="logo globo"/.test(m[0]))?.[0];
 const publishedUrl = tag?.match(/src="([^"]+)"/)?.[1];
 if(publishedUrl) globo.asset=publishedUrl;
}
for(let i=0;i<pending.length;i+=3) await Promise.all(pending.slice(i,i+3).map(collect));
await fs.writeFile(path.join(out,'fontes.json'),JSON.stringify({checkedAt:'2026-09-02',scope:'20 active entries in Hero.tsx + 6 unique legacy entries in unused InstitutionalClients.tsx; not verification of commercial relationships',publication:'Not authorized: research only; no changes to site',clients:list},null,2));
console.log('Saved',out);
