import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Share2 } from 'lucide-react';
import { getBlogArticle } from '../data/blogArticles';

export const PageBlogArticle: React.FC = () => {
  const { slug } = useParams();
  const article = getBlogArticle(slug);

  if (!article) return <Navigate to="/blogue" replace />;

  const canonical = `https://pepekgrupo.com/blogue/${article.slug}`;
  const shareArticle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
    } catch { /* O cancelamento da partilha não deve interromper a página. */ }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: `https://pepekgrupo.com${article.image}`,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'PEPEK Grupo Rent a Car' },
    publisher: { '@type': 'Organization', name: 'PEPEK GRUPO' },
  };

  return <>
    <Helmet>
      <title>{`${article.title} | PEPEK GRUPO`}</title>
      <meta name="description" content={article.excerpt} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.excerpt} />
      <meta property="og:image" content={`https://pepekgrupo.com${article.image}`} />
      <meta property="article:published_time" content={article.publishedAt} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>

    <main className="bg-[#F5F6F6] pb-20 pt-28 text-[#09172C]">
      <article>
        <header className="bg-[#001E4A] py-12 text-white sm:py-16">
          <div className="container-pepek">
            <Link to="/blogue" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-[#FEC228]"><ArrowLeft className="h-4 w-4" /> Voltar ao blogue</Link>
            <div className="mt-8 max-w-4xl">
              <span className="inline-flex rounded-full bg-[#FEC228] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#09172C]">Parcerias</span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight !text-white sm:text-4xl lg:text-5xl">{article.title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/65">
                <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#FEC228]" /><time dateTime={article.publishedAt}>{article.publishedLabel}</time></span>
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FEC228]" />{article.readingTime} de leitura</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container-pepek -mt-1 grid gap-10 pt-10 lg:grid-cols-[minmax(0,760px)_280px] lg:justify-center">
          <div>
            <figure className="overflow-hidden rounded-3xl bg-[#001E4A] shadow-[0_20px_50px_rgba(9,23,44,.18)]">
              <img src={article.image} alt={article.imageAlt} className="h-auto w-full" width="1080" height="1350" />
            </figure>
            <div className="mt-10 rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-11">
              <p className="text-lg font-semibold leading-8 text-[#17365f]">{article.paragraphs[0]}</p>
              <div className="mt-8 space-y-6 text-[1.02rem] leading-8 text-slate-700">
                {article.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <p className="mt-10 border-l-4 border-[#FEC228] pl-5 text-lg font-extrabold text-[#001E4A]">{article.signature}</p>
            </div>
          </div>

          <aside className="lg:pt-1">
            <div className="sticky top-32 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#236199]">Partilhar notícia</p>
              <button type="button" onClick={() => void shareArticle()} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#001E4A] px-4 text-sm font-extrabold text-white transition hover:bg-[#174B86]"><Share2 className="h-4 w-4" /> Partilhar</button>
              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="font-extrabold text-[#001E4A]">Mobilidade para instituições e empresas</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Conheça as soluções PEPEK para operações, delegações e eventos.</p>
                <Link to="/contactos" className="mt-4 inline-flex text-sm font-extrabold text-[#174B86] hover:underline">Falar com a PEPEK →</Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  </>;
};
