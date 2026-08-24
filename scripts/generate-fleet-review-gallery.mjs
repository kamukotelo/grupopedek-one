import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = await fs.readFile(path.join(root, 'src/data/fleetData.ts'), 'utf8');
const assetRoot = path.join(root, 'public/fleet-carousel');
const generatedRoot = path.join(root, 'public/fleet-carousel-generated');
const pattern = /\{\s*\n\s*id: '([^']+)',[\s\S]*?\n\s*name: '([^']+)',\s*\n\s*brand: '([^']+)',\s*\n\s*model: '([^']+)'/g;
const vehicles = [...source.matchAll(pattern)].map((match) => ({ id: match[1], name: match[2], brand: match[3], model: match[4] }));

const officialPortalByBrand = {
  'Land Rover': 'https://media.landrover.com',
  'Mercedes-Benz': 'https://media.mercedes-benz.com',
  Lexus: 'https://pressroom.lexus.com',
  Toyota: 'https://pressroom.toyota.com',
  Volvo: 'https://www.media.volvocars.com',
  Nissan: 'https://newsroom.nissan-global.com',
  Hyundai: 'https://www.hyundainews.com',
  Chery: 'https://www.cheryinternational.com/media',
  Jetour: 'https://www.jetour-global.com/media',
  Mitsubishi: 'https://www.mitsubishi-motors.com/en/newsroom',
  Suzuki: 'https://www.globalsuzuki.com/media',
  Kia: 'https://www.kianewscenter.com',
  'Lincoln / Cadillac': 'https://media.cadillac.com',
};

const rightsByAsset = new Map();
for (const file of await fs.readdir(assetRoot)) {
  if (!/^manifest-part-\d+\.json$/.test(file)) continue;
  const manifest = JSON.parse(await fs.readFile(path.join(assetRoot, file), 'utf8'));
  for (const [vehicleId, entry] of Object.entries(manifest.vehicles || {})) {
    for (const image of entry.images || []) {
      const base = path.basename(image.file, path.extname(image.file));
      rightsByAsset.set(`${vehicleId}/${base}`, {
        license: image.license || '',
        licenseUrl: image.licenseUrl || '',
        sourcePage: image.sourcePage || '',
        author: String(image.author || '').replace(/<[^>]*>/g, '').trim(),
      });
    }
  }
}

const cards = [];
for (const vehicle of vehicles) {
  const files = (await fs.readdir(path.join(assetRoot, vehicle.id)))
    .filter((file) => /\.(webp|jpe?g|png)$/i.test(file))
    .sort();
  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const rights = rightsByAsset.get(`${vehicle.id}/${base}`) || {};
    cards.push({
      ...vehicle,
      file,
      url: `/fleet-carousel/${vehicle.id}/${file}`,
      source: 'Wikimedia Commons',
      officialPortal: officialPortalByBrand[vehicle.brand] || '',
      rightsType: 'licensed',
      ...rights,
    });
  }
  try {
    const generatedFiles = (await fs.readdir(path.join(generatedRoot, vehicle.id)))
      .filter((file) => /\.(webp|jpe?g|png)$/i.test(file))
      .filter((file) => file !== 'catalog-v1.webp')
      .sort();
    for (const file of generatedFiles) cards.push({
      ...vehicle,
      file,
      url: `/fleet-carousel-generated/${vehicle.id}/${file}`,
      source: 'Catálogo gerado por IA',
      officialPortal: officialPortalByBrand[vehicle.brand] || '',
      rightsType: 'generated',
      license: 'Conteúdo gerado internamente',
      licenseUrl: '',
      sourcePage: '',
      author: 'PEPEK — ambiente de demonstração',
    });
  } catch {
    // Alguns modelos ainda podem não ter uma opção de catálogo gerada.
  }
}

const data = JSON.stringify(cards).replaceAll('</script>', '<\\/script>');
const html = `<!doctype html>
<html lang="pt-AO">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PEPEK — Revisão Visual da Frota</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background:#eef1f6; color:#07133f; }
    * { box-sizing:border-box; }
    body { margin:0; }
    header { position:sticky; top:0; z-index:10; padding:18px 24px; color:white; background:rgba(2,10,42,.96); box-shadow:0 8px 30px #07133f22; }
    header h1 { margin:0 0 4px; font-size:clamp(20px,3vw,34px); }
    header p { margin:0 0 14px; color:#cad3ec; }
    .toolbar { display:flex; flex-wrap:wrap; gap:8px; }
    input, select, button, .link { min-height:40px; border-radius:10px; border:1px solid #ccd3e1; padding:9px 12px; font:inherit; }
    input { min-width:240px; flex:1; }
    button, .link { cursor:pointer; background:white; color:#07133f; font-weight:750; text-decoration:none; }
    button.active { background:#d2a820; border-color:#d2a820; }
    main { max-width:1680px; margin:auto; padding:22px; }
    .summary { display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:16px; font-weight:750; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; }
    article { overflow:hidden; border:1px solid #d9dee7; border-radius:18px; background:white; box-shadow:0 8px 22px #07133f12; }
    figure { margin:0; height:220px; display:grid; place-items:center; background:linear-gradient(135deg,#f8f9fb,#dfe4eb); }
    img { width:100%; height:100%; object-fit:contain; }
    .body { padding:13px; }
    h2 { margin:0 0 4px; font-size:15px; }
    .meta { margin:0 0 10px; font-size:12px; color:#64708a; overflow-wrap:anywhere; }
    .badges { display:flex; flex-wrap:wrap; gap:5px; margin:9px 0; }
    .badge { border-radius:999px; padding:4px 8px; font-size:10px; font-weight:800; background:#e8edf6; }
    .badge.ok { color:#08733f; background:#dcf8e9; }
    .badge.warn { color:#885800; background:#fff1c2; }
    .rights { padding:9px; border-radius:10px; background:#f5f7fb; font-size:11px; line-height:1.45; }
    .rights a { color:#0b45d8; font-weight:750; }
    .checks { display:grid; gap:5px; margin:10px 0; }
    .checks label { display:flex; align-items:flex-start; gap:7px; font-size:11px; color:#34405a; }
    .checks input { min-width:0; flex:0 0 auto; min-height:0; margin-top:2px; }
    .actions { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
    .actions button { min-height:34px; padding:6px; font-size:11px; }
    .actions button:disabled { cursor:not-allowed; opacity:.35; }
    .open { display:block; margin-top:8px; text-align:center; background:#07133f; color:white; border-color:#07133f; }
    article[data-status="approved"] { outline:3px solid #18a05e; }
    article[data-status="cleanup"] { outline:3px solid #e3a008; }
    article[data-status="rejected"] { opacity:.45; outline:3px solid #d13737; }
    .legend { font-size:12px; color:#58647d; }
    @media (max-width:640px) { header, main { padding:14px; } figure { height:190px; } }
  </style>
</head>
<body>
  <header>
    <h1>Acervo de apoio — 47 viaturas PEPEK</h1>
    <p><strong>Referência interna: não publicar sem autorização ou licença comprovada.</strong> Use estas opções apenas para comparação e tomada de decisão.</p>
    <div class="toolbar">
      <input id="search" type="search" placeholder="Pesquisar marca, modelo ou viatura…" />
      <select id="vehicle"><option value="">Todas as 47 viaturas</option></select>
      <select id="status">
        <option value="">Todos os estados</option>
        <option value="approved">Aprovadas</option>
        <option value="cleanup">Limpar fundo</option>
        <option value="rejected">Rejeitadas</option>
        <option value="pending">Sem revisão</option>
      </select>
      <button id="export">Exportar seleção</button>
      <a class="link" href="/fleet-migration-beta/">Abrir migração beta</a>
    </div>
  </header>
  <main>
    <div class="summary"><span id="count"></span><span class="legend">O portal oficial é referência de pesquisa, não autorização automática de publicação.</span></div>
    <section id="grid" class="grid"></section>
  </main>
  <script>
    const images = ${data};
    const key = 'pepek-fleet-image-review-v2';
    const review = JSON.parse(localStorage.getItem(key) || '{}');
    const grid = document.querySelector('#grid');
    const search = document.querySelector('#search');
    const vehicle = document.querySelector('#vehicle');
    const status = document.querySelector('#status');
    const count = document.querySelector('#count');
    [...new Map(images.map(i => [i.id, i])).values()].forEach(i => vehicle.add(new Option(i.name, i.id)));

    function itemReview(url) {
      return review[url] || { status:'pending', rights:false, people:false, plates:false };
    }
    function setStatus(url, value) {
      const current = itemReview(url);
      if (value === 'approved' && !(current.rights && current.people && current.plates)) return;
      current.status = current.status === value ? 'pending' : value;
      review[url] = current;
      localStorage.setItem(key, JSON.stringify(review));
      render();
    }
    function setCheck(url, field, checked) {
      const current = itemReview(url);
      current[field] = checked;
      if ((!current.rights || !current.people || !current.plates) && current.status === 'approved') current.status = 'pending';
      review[url] = current;
      localStorage.setItem(key, JSON.stringify(review));
      render();
    }
    function esc(value) {
      return String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    }
    function render() {
      const q = search.value.trim().toLowerCase();
      const filtered = images.filter(i => {
        const imageStatus = itemReview(i.url).status;
        return (!q || (i.name + ' ' + i.brand + ' ' + i.model + ' ' + i.source).toLowerCase().includes(q))
          && (!vehicle.value || i.id === vehicle.value)
          && (!status.value || imageStatus === status.value);
      });
      count.textContent = filtered.length + ' de ' + images.length + ' fotografias';
      grid.innerHTML = filtered.map(i => {
        const current = itemReview(i.url);
        const rightsEligible = i.rightsType === 'generated' || Boolean(i.license && i.licenseUrl && i.sourcePage);
        const ready = rightsEligible && current.rights && current.people && current.plates;
        const sourceLink = i.sourcePage ? '<a href="' + esc(i.sourcePage) + '" target="_blank" rel="noreferrer">Página da licença</a>' : '';
        const portalLink = i.officialPortal ? '<a href="' + esc(i.officialPortal) + '" target="_blank" rel="noreferrer">Portal oficial para pesquisa</a>' : 'Portal oficial não indicado';
        return '<article data-status="' + current.status + '"><a href="' + esc(i.url) + '" target="_blank"><figure><img loading="lazy" src="' + esc(i.url) + '" alt="' + esc(i.name) + '"></figure></a><div class="body"><h2>' + esc(i.name) + '</h2><p class="meta"><strong>' + esc(i.source) + '</strong><br>' + esc(i.brand) + ' · ' + esc(i.model) + '<br>' + esc(i.file) + '</p><div class="badges"><span class="badge ' + (rightsEligible ? 'ok' : 'warn') + '">' + esc(rightsEligible ? i.license : 'Bloqueada: licença incompleta') + '</span><span class="badge ' + (i.rightsType === 'generated' ? 'warn' : 'ok') + '">' + (i.rightsType === 'generated' ? 'Imagem IA' : 'Fonte rastreável') + '</span></div><div class="rights">Autor/criador: ' + esc(i.author || 'não registado') + '<br>' + sourceLink + (sourceLink ? ' · ' : '') + portalLink + '</div><div class="checks"><label><input type="checkbox" data-url="' + esc(i.url) + '" data-check="rights" ' + (current.rights ? 'checked' : '') + ' ' + (rightsEligible ? '' : 'disabled') + '> Confirmei a licença, autoria e condições de uso</label><label><input type="checkbox" data-url="' + esc(i.url) + '" data-check="people" ' + (current.people ? 'checked' : '') + '> Confirmei que não existem pessoas na imagem</label><label><input type="checkbox" data-url="' + esc(i.url) + '" data-check="plates" ' + (current.plates ? 'checked' : '') + '> Confirmei que não existe qualquer matrícula visível</label></div><div class="actions"><button data-url="' + esc(i.url) + '" data-value="approved" ' + (ready ? '' : 'disabled') + '>✓ Aprovar</button><button data-url="' + esc(i.url) + '" data-value="cleanup">✦ Limpar</button><button data-url="' + esc(i.url) + '" data-value="rejected">× Rejeitar</button></div><a class="link open" href="' + esc(i.url) + '" target="_blank" download>Abrir / descarregar</a></div></article>';
      }).join('');
      grid.querySelectorAll('button[data-value]').forEach(button => button.addEventListener('click', () => setStatus(button.dataset.url, button.dataset.value)));
      grid.querySelectorAll('input[data-check]').forEach(input => input.addEventListener('change', () => setCheck(input.dataset.url, input.dataset.check, input.checked)));
    }
    [search, vehicle, status].forEach(control => control.addEventListener('input', render));
    document.querySelector('#export').addEventListener('click', () => {
      const payload = images.map(i => ({ vehicleId:i.id, vehicle:i.name, image:i.url, source:i.source, author:i.author, license:i.license, licenseUrl:i.licenseUrl, sourcePage:i.sourcePage, officialPortal:i.officialPortal, ...itemReview(i.url) }));
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pepek-selecao-imagens.json'; a.click(); URL.revokeObjectURL(a.href);
    });
    render();
  </script>
</body>
</html>`;

await fs.writeFile(path.join(assetRoot, 'index.html'), html);
console.log(`Galeria de revisão criada com ${cards.length} fotografias e ${vehicles.length} viaturas.`);
