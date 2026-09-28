import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { i18nReady } from './i18n';
import { capturePrerenderedMain } from './lib/prerenderedMain';
import './index.css';

/**
 * O index.html traz um <title>, uma description e tags og: estáticas para que os
 * leitores que não executam JavaScript (WhatsApp, Facebook, LinkedIn) tenham
 * sempre uma pré-visualização da marca. Assim que o React monta, o Helmet passa
 * a fornecer os valores por página — as estáticas têm de sair, senão cada página
 * fica com dois <title>, duas descriptions e dois og:url.
 */
document.querySelectorAll('[data-static-seo]').forEach((node) => node.remove());

const rootElement = document.getElementById('root')!;
capturePrerenderedMain(rootElement);

// Em português as traduções já estão no bundle e isto resolve de imediato; em
// inglês/francês espera-se pelo chunk do idioma para não pintar texto em PT.
const renderApp = () => ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
i18nReady.then(renderApp, renderApp);
