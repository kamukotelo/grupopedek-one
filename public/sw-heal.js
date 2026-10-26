// Corre dentro do service worker (importado pelo sw.js gerado pelo Workbox).
//
// Alguns telemóveis ficaram presos numa versão antiga do site guardada em cache
// (logótipo e imagens partidas, texto desatualizado). Quando este service worker
// novo ativa, apaga as caches de imagens/ficheiros que podiam estar estragadas e
// recarrega as páginas abertas que ainda correm código antigo. As páginas da versão
// nova respondem ao aviso e não são recarregadas (ninguém perde um formulário).
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all(['pepek-visual-assets', 'pepek-lazy-chunks'].map((name) => caches.delete(name)));

    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (clients.length === 0) return;

    const alive = new Set();
    const onMessage = (message) => {
      if (message.data && message.data.type === 'PEPEK_OK' && message.source) alive.add(message.source.id);
    };
    self.addEventListener('message', onMessage);
    clients.forEach((client) => client.postMessage({ type: 'PEPEK_SW_ACTIVATED' }));
    await new Promise((resolve) => setTimeout(resolve, 2500));
    self.removeEventListener('message', onMessage);

    // Sem "await": a navegação só avança depois de a ativação terminar, por isso esperar
    // por ela aqui deixaria o service worker e a página à espera um do outro.
    clients.filter((client) => !alive.has(client.id)).forEach((client) => { client.navigate(client.url).catch(() => undefined); });
  })());
});
