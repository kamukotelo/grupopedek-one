import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = await fs.readFile(path.join(root, 'src/data/fleetData.ts'), 'utf8');
const assetRoot = path.join(root, 'public/fleet-carousel');
const generatedRoot = path.join(root, 'public/fleet-carousel-generated');
const pattern = /\{\s*\n\s*id: '([^']+)',[\s\S]*?\n\s*name: '([^']+)',\s*\n\s*brand: '([^']+)',\s*\n\s*model: '([^']+)'/g;
const vehicles = [...source.matchAll(pattern)].map((match) => ({ id: match[1], name: match[2], brand: match[3], model: match[4] }));

const cards = [];
for (const vehicle of vehicles) {
  const files = (await fs.readdir(path.join(assetRoot, vehicle.id)))
    .filter((file) => /\.(webp|jpe?g|png)$/i.test(file))
    .sort();
  for (const file of files) cards.push({ ...vehicle, file, url: `/fleet-carousel/${vehicle.id}/${file}`, source: 'Fotografia encontrada' });
  try {
    const generatedFiles = (await fs.readdir(path.join(generatedRoot, vehicle.id)))
      .filter((file) => /\.(webp|jpe?g|png)$/i.test(file))
      .sort();
    for (const file of generatedFiles) cards.push({ ...vehicle, file, url: `/fleet-carousel-generated/${vehicle.id}/${file}`, source: 'Catálogo gerado por IA' });
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
    .actions { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
    .actions button { min-height:34px; padding:6px; font-size:11px; }
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
    <h1>Acervo visual — 47 viaturas PEPEK</h1>
    <p>Selecione carros limpos e isolados, preferencialmente preto, prata, cinzento ou branco. As marcações ficam guardadas neste navegador.</p>
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
    </div>
  </header>
  <main>
    <div class="summary"><span id="count"></span><span class="legend">Verde: aprovada · Amarelo: limpar · Vermelho: rejeitada</span></div>
    <section id="grid" class="grid"></section>
  </main>
  <script>
    const images = ${data};
    const key = 'pepek-fleet-image-review-v1';
    const review = JSON.parse(localStorage.getItem(key) || '{}');
    const grid = document.querySelector('#grid');
    const search = document.querySelector('#search');
    const vehicle = document.querySelector('#vehicle');
    const status = document.querySelector('#status');
    const count = document.querySelector('#count');
    [...new Map(images.map(i => [i.id, i])).values()].forEach(i => vehicle.add(new Option(i.name, i.id)));

    function setStatus(url, value) {
      if (review[url] === value) delete review[url]; else review[url] = value;
      localStorage.setItem(key, JSON.stringify(review));
      render();
    }
    function render() {
      const q = search.value.trim().toLowerCase();
      const filtered = images.filter(i => {
        const imageStatus = review[i.url] || 'pending';
        return (!q || (i.name + ' ' + i.brand + ' ' + i.model + ' ' + i.source).toLowerCase().includes(q))
          && (!vehicle.value || i.id === vehicle.value)
          && (!status.value || imageStatus === status.value);
      });
      count.textContent = filtered.length + ' de ' + images.length + ' fotografias';
      grid.innerHTML = filtered.map(i => {
        const current = review[i.url] || 'pending';
        return '<article data-status="' + current + '"><a href="' + i.url + '" target="_blank"><figure><img loading="lazy" src="' + i.url + '" alt="' + i.name + '"></figure></a><div class="body"><h2>' + i.name + '</h2><p class="meta"><strong>' + i.source + '</strong><br>' + i.brand + ' · ' + i.model + '<br>' + i.file + '</p><div class="actions"><button data-url="' + i.url + '" data-value="approved">✓ Aprovar</button><button data-url="' + i.url + '" data-value="cleanup">✦ Limpar</button><button data-url="' + i.url + '" data-value="rejected">× Rejeitar</button></div><a class="link open" href="' + i.url + '" target="_blank" download>Abrir / descarregar</a></div></article>';
      }).join('');
      grid.querySelectorAll('button').forEach(button => button.addEventListener('click', () => setStatus(button.dataset.url, button.dataset.value)));
    }
    [search, vehicle, status].forEach(control => control.addEventListener('input', render));
    document.querySelector('#export').addEventListener('click', () => {
      const payload = images.map(i => ({ vehicleId:i.id, vehicle:i.name, image:i.url, status:review[i.url] || 'pending' }));
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pepek-selecao-imagens.json'; a.click(); URL.revokeObjectURL(a.href);
    });
    render();
  </script>
</body>
</html>`;

await fs.writeFile(path.join(assetRoot, 'index.html'), html);
console.log(`Galeria de revisão criada com ${cards.length} fotografias e ${vehicles.length} viaturas.`);
