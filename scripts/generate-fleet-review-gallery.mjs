import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = await fs.readFile(path.join(root, 'src/data/fleetData.ts'), 'utf8');
const flyerSource = await fs.readFile(path.join(root, 'src/data/fleetFlyer2026.ts'), 'utf8');
const assetRoot = path.join(root, 'public/fleet-carousel');
const generatedRoot = path.join(root, 'public/fleet-carousel-generated');
const pattern = /\{\s*\n\s*id: '([^']+)',[\s\S]*?\n\s*name: '([^']+)',\s*\n\s*brand: '([^']+)',\s*\n\s*model: '([^']+)'/g;
const vehicles = [...source.matchAll(pattern)].map((match) => ({ id: match[1], name: match[2], brand: match[3], model: match[4] }));
const flyerPattern = /\{ id: '([^']+)', name: '([^']+)', fullDay: [^,]+, transfer: [^,]+, image: '([^']+)' \}/g;
const flyerVehicles = [...flyerSource.matchAll(flyerPattern)].map((match) => ({ id: match[1], name: match[2], image: match[3] }));
const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

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

function inferBrand(name) {
  if (/^Range Rover/i.test(name)) return 'Land Rover';
  if (/^Mercedes/i.test(name)) return 'Mercedes-Benz';
  if (/^(Nova|Novo) Toyota|^Toyota/i.test(name)) return 'Toyota';
  if (/^Limousine/i.test(name)) return 'Lincoln / Cadillac';
  return name.split(' ')[0];
}

const interiorResearch = flyerVehicles.map((entry) => {
  const legacy = vehicleById.get(entry.id);
  const brand = legacy?.brand || inferBrand(entry.name);
  const model = legacy?.model || entry.name.replace(/^(Nova|Novo)\s+/i, '').replace(new RegExp('^' + brand.replace('Land Rover', 'Range Rover') + '\\s+', 'i'), '');
  const query = `${entry.name} 2026`;
  const commons = (view) => `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(`${query} ${view}`)}&title=Special:MediaSearch&type=image`;
  return {
    ...entry,
    brand,
    model,
    officialPortal: officialPortalByBrand[brand] || '',
    cockpitUrl: commons('interior dashboard cockpit'),
    cabinUrl: commons('interior seats cabin'),
    cargoUrl: commons('interior luggage cargo'),
  };
});

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

function firstMatching(items, pattern, used) {
  const match = items.find((item) => pattern.test(item.file) && !used.has(item.url));
  if (match) used.add(match.url);
  return match?.url || '';
}

const fleetHub = interiorResearch.map((vehicle) => {
  const candidates = cards.filter((item) => item.id === vehicle.id);
  const used = new Set();
  return {
    ...vehicle,
    slots: {
      front: `/fleet-flyer-2026/${vehicle.image}/01-oficial.webp`,
      side: firstMatching(candidates, /(side|lateral|exterior)/i, used),
      rear: firstMatching(candidates, /(rear|traseir)/i, used),
      cockpit: firstMatching(candidates, /(cockpit|dashboard|interior)/i, used),
      passengers: firstMatching(candidates, /(passageiros|passenger|interior)/i, used),
    },
  };
});

const data = JSON.stringify(cards).replaceAll('</script>', '<\\/script>');
const researchData = JSON.stringify(interiorResearch).replaceAll('</script>', '<\\/script>');
const hubData = JSON.stringify(fleetHub).replaceAll('</script>', '<\\/script>');
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
    .view-tabs { display:flex; gap:8px; margin-top:10px; }
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
    .research-hero { height:180px; padding:22px; display:flex; flex-direction:column; justify-content:flex-end; color:white; background:linear-gradient(145deg,#07133f,#173871 68%,#c99a24); }
    .research-hero .eyebrow { margin-bottom:auto; font-size:11px; font-weight:900; letter-spacing:.12em; color:#f2c94c; }
    .research-hero h2 { font-size:21px; }
    .research-links { display:grid; gap:7px; margin-top:12px; }
    .research-links .link { display:block; text-align:center; background:#f6f8fc; }
    .research-links .official { background:#07133f; color:white; border-color:#07133f; }
    .notice { margin:0 0 16px; padding:12px 14px; border:1px solid #e5c45a; border-radius:12px; background:#fff8dc; color:#654b00; font-size:13px; }
    .hub-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(430px,1fr)); gap:20px; }
    .hub-card { position:relative; }
    .hub-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:15px 16px; color:white; background:#07133f; }
    .hub-head h2 { font-size:18px; }
    .hub-head p { margin:3px 0 0; color:#bfc9e4; font-size:12px; }
    .hub-progress { white-space:nowrap; border-radius:999px; padding:6px 9px; color:#07133f; background:#e0b31f; font-size:11px; font-weight:900; }
    .mosaic { display:grid; grid-template-columns:1.2fr 1fr; grid-template-rows:240px 135px 135px; gap:2px; background:#d7dce6; }
    .shot { position:relative; min-width:0; overflow:hidden; background:linear-gradient(145deg,#101a3d,#32436b); }
    .shot.main { grid-column:1 / -1; }
    .shot img { object-fit:cover; }
    .shot.selected { outline:4px solid #19a564; outline-offset:-4px; }
    .shot-label { position:absolute; left:8px; bottom:8px; border-radius:999px; padding:5px 8px; color:white; background:#07133fdd; font-size:10px; font-weight:850; }
    .choose-shot { position:absolute; right:8px; bottom:8px; min-height:30px; padding:5px 8px; border:0; border-radius:999px; font-size:10px; }
    .choose-shot.chosen { color:white; background:#15945a; }
    .empty-shot { height:100%; display:grid; place-items:center; padding:18px; text-align:center; color:#cbd4ea; font-size:12px; }
    .empty-shot strong { display:block; margin-bottom:4px; color:white; }
    .hub-foot { padding:12px 15px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
    .hub-foot p { margin:0; color:#65708a; font-size:11px; }
    .hub-foot .link { flex:0 0 auto; background:#f5f7fb; }
    [hidden] { display:none !important; }
    @media (max-width:640px) { header, main { padding:14px; } figure { height:190px; } }
  </style>
</head>
<body>
  <header>
    <h1>Acervo de apoio — Frota oficial 2026</h1>
    <p><strong>Referência interna: não publicar sem autorização ou licença comprovada.</strong> Use estas opções apenas para comparação e tomada de decisão.</p>
    <div class="toolbar">
      <input id="search" type="search" placeholder="Pesquisar marca, modelo ou viatura…" />
      <select id="vehicle"><option value="">Todas as viaturas</option></select>
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
    <div class="view-tabs">
      <button id="show-hub" class="active">Hub visual · 46 viaturas</button>
      <button id="show-images">Fotografias existentes</button>
      <button id="show-research">Links de interiores 2026</button>
    </div>
  </header>
  <main>
    <p id="hub-notice" class="notice"><strong>Área de gestão e decisão:</strong> composição provisória das 46 viaturas oficiais. As fotografias auxiliares não passam para a frota pública enquanto não forem aprovadas.</p>
    <p id="research-notice" class="notice" hidden><strong>Área de decisão:</strong> estes links servem apenas para pesquisar cockpit, bancos e bagageira. Nenhuma imagem desta área foi inserida na frota pública. A licença e a correspondência exata do modelo/ano devem ser confirmadas antes de qualquer utilização.</p>
    <div class="summary"><span id="count"></span><span class="legend">O portal oficial é referência de pesquisa, não autorização automática de publicação.</span></div>
    <section id="grid" class="grid"></section>
  </main>
  <script>
    const images = ${data};
    const research = ${researchData};
    const hub = ${hubData};
    const key = 'pepek-fleet-image-review-v2';
    const hubKey = 'pepek-fleet-hub-selection-v1';
    const review = JSON.parse(localStorage.getItem(key) || '{}');
    const hubSelection = JSON.parse(localStorage.getItem(hubKey) || '{}');
    const grid = document.querySelector('#grid');
    const search = document.querySelector('#search');
    const vehicle = document.querySelector('#vehicle');
    const status = document.querySelector('#status');
    const count = document.querySelector('#count');
    let activeView = 'hub';
    [...new Map([...research, ...images].map(i => [i.id, i])).values()].forEach(i => vehicle.add(new Option(i.name, i.id)));

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
    function toggleHubSelection(vehicleId, slot, url) {
      hubSelection[vehicleId] ||= {};
      if (hubSelection[vehicleId][slot] === url) delete hubSelection[vehicleId][slot];
      else hubSelection[vehicleId][slot] = url;
      if (!Object.keys(hubSelection[vehicleId]).length) delete hubSelection[vehicleId];
      localStorage.setItem(hubKey, JSON.stringify(hubSelection));
      render();
    }
    function esc(value) {
      return String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    }
    function render() {
      const q = search.value.trim().toLowerCase();
      const isResearch = activeView === 'research';
      const isHub = activeView === 'hub';
      status.hidden = isResearch || isHub;
      document.querySelector('#export').hidden = isResearch;
      document.querySelector('#export').textContent = isHub ? 'Exportar escolhas do hub' : 'Exportar seleção';
      document.querySelector('#research-notice').hidden = !isResearch;
      document.querySelector('#hub-notice').hidden = !isHub;
      grid.className = isHub ? 'hub-grid' : 'grid';
      if (isHub) {
        const filteredHub = hub.filter(i => (!q || (i.name + ' ' + i.brand + ' ' + i.model).toLowerCase().includes(q)) && (!vehicle.value || i.id === vehicle.value));
        count.textContent = filteredHub.length + ' de ' + hub.length + ' viaturas oficiais organizadas';
        const shot = (url, label, main, vehicleId, slot) => {
          const chosen = Boolean(url && hubSelection[vehicleId]?.[slot] === url);
          return '<div class="shot ' + (main ? 'main ' : '') + (chosen ? 'selected' : '') + '">' + (url ? '<a href="' + esc(url) + '" target="_blank"><img loading="lazy" src="' + esc(url) + '" alt="' + esc(label) + '"></a><button class="choose-shot ' + (chosen ? 'chosen' : '') + '" data-hub-id="' + esc(vehicleId) + '" data-slot="' + esc(slot) + '" data-url="' + esc(url) + '">' + (chosen ? '✓ Escolhida' : '+ Escolher') + '</button>' : '<div class="empty-shot"><span><strong>' + esc(label) + '</strong>Imagem ainda por selecionar/criar</span></div>') + '<span class="shot-label">' + esc(label) + '</span></div>';
        };
        grid.innerHTML = filteredHub.map(i => {
          const available = Object.values(i.slots).filter(Boolean).length;
          const selected = Object.keys(hubSelection[i.id] || {}).length;
          return '<article class="hub-card"><div class="hub-head"><div><h2>' + esc(i.name) + '</h2><p>' + esc(i.brand) + ' · Catálogo oficial 2026</p></div><span class="hub-progress">' + selected + ' escolhidas · ' + available + '/5 disponíveis</span></div><div class="mosaic">' + shot(i.slots.front, 'Exterior principal', true, i.id, 'front') + shot(i.slots.side || i.slots.rear, i.slots.side ? 'Vista lateral' : 'Vista traseira', false, i.id, i.slots.side ? 'side' : 'rear') + shot(i.slots.cockpit, 'Cockpit / painel', false, i.id, 'cockpit') + shot(i.slots.passengers, 'Bancos / passageiros', false, i.id, 'passengers') + shot(i.slots.rear && i.slots.side ? i.slots.rear : '', 'Vista traseira', false, i.id, 'rear') + '</div><div class="hub-foot"><p>Escolher não publica: direitos, modelo e matrículas continuam sujeitos a validação.</p><button class="link open-research" data-id="' + esc(i.id) + '">Procurar interiores</button></div></article>';
        }).join('');
        grid.querySelectorAll('.choose-shot').forEach(button => button.addEventListener('click', () => toggleHubSelection(button.dataset.hubId, button.dataset.slot, button.dataset.url)));
        grid.querySelectorAll('.open-research').forEach(button => button.addEventListener('click', () => { vehicle.value = button.dataset.id; activeView = 'research'; syncTabs(); render(); }));
        return;
      }
      if (isResearch) {
        const filteredResearch = research.filter(i => (!q || (i.name + ' ' + i.brand + ' ' + i.model).toLowerCase().includes(q)) && (!vehicle.value || i.id === vehicle.value));
        count.textContent = filteredResearch.length + ' de ' + research.length + ' viaturas oficiais com pesquisa de interiores';
        grid.innerHTML = filteredResearch.map(i => '<article><div class="research-hero"><span class="eyebrow">INTERIORES · APOIO À DECISÃO</span><h2>' + esc(i.name) + '</h2><span>' + esc(i.brand) + ' · ' + esc(i.model) + '</span></div><div class="body"><div class="badges"><span class="badge warn">Não publicado</span><span class="badge warn">Direitos por confirmar</span><span class="badge ok">3 pesquisas direcionadas</span></div><p class="meta">Compare apenas imagens que correspondam exatamente ao modelo, geração, configuração e ano pretendidos.</p><div class="research-links">' + (i.officialPortal ? '<a class="link official" href="' + esc(i.officialPortal) + '" target="_blank" rel="noreferrer">Portal oficial da marca</a>' : '') + '<a class="link" href="' + esc(i.cockpitUrl) + '" target="_blank" rel="noreferrer">Opções de cockpit / painel</a><a class="link" href="' + esc(i.cabinUrl) + '" target="_blank" rel="noreferrer">Opções de bancos / passageiros</a><a class="link" href="' + esc(i.cargoUrl) + '" target="_blank" rel="noreferrer">Opções de bagageira / carga</a></div></div></article>').join('');
        return;
      }
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
    function syncTabs() {
      document.querySelector('#show-hub').classList.toggle('active', activeView === 'hub');
      document.querySelector('#show-images').classList.toggle('active', activeView === 'images');
      document.querySelector('#show-research').classList.toggle('active', activeView === 'research');
    }
    document.querySelector('#show-hub').addEventListener('click', () => { activeView = 'hub'; syncTabs(); render(); });
    document.querySelector('#show-images').addEventListener('click', () => { activeView = 'images'; syncTabs(); render(); });
    document.querySelector('#show-research').addEventListener('click', () => { activeView = 'research'; syncTabs(); render(); });
    document.querySelector('#export').addEventListener('click', () => {
      if (activeView === 'hub') {
        const payload = hub.map(i => ({ vehicleId:i.id, vehicle:i.name, selected:hubSelection[i.id] || {}, publicationStatus:'decision_only' })).filter(i => Object.keys(i.selected).length);
        const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pepek-escolhas-hub-46.json'; a.click(); URL.revokeObjectURL(a.href);
        return;
      }
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
