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

    <main className="bg-[#F5F6F6] pb-16 pt-24 text-[#09172C] sm:pb-20 sm:pt-28">
      <article>
        <header className="bg-[#001E4A] py-9 text-white sm:py-14 lg:py-16">
          <div className="container-pepek">
            <Link to="/blogue" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-[#FEC228]"><ArrowLeft className="h-4 w-4" /> Voltar ao blogue</Link>
            <div className="mt-6 max-w-6xl sm:mt-8">
              <span className="inline-flex rounded-full bg-[#FEC228] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#09172C]">Parcerias</span>
              <h1 className="mt-4 max-w-5xl text-[1.7rem] font-extrabold leading-[1.16] !text-white sm:mt-5 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1] [text-wrap:balance]">{article.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70 sm:mt-6 sm:text-sm">
                <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#FEC228]" /><time dateTime={article.publishedAt}>{article.publishedLabel}</time></span>
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FEC228]" />{article.readingTime} de leitura</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container-pepek grid gap-6 pt-6 sm:gap-8 sm:pt-10 lg:grid-cols-[minmax(270px,360px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(300px,390px)_minmax(0,720px)_240px] xl:gap-10">
          <figure className="overflow-hidden rounded-2xl bg-[#001E4A] shadow-[0_20px_50px_rgba(9,23,44,.16)] sm:rounded-3xl lg:sticky lg:top-32">
            <img src={article.image} alt={article.imageAlt} className="aspect-[4/5] h-full max-h-[78svh] w-full object-cover object-top" width="1080" height="1350" />
          </figure>

          <div className="rounded-2xl bg-white px-5 py-7 shadow-sm sm:rounded-3xl sm:px-9 sm:py-10 lg:px-10 xl:px-11">
            <p className="hyphens-auto text-justify text-[1.05rem] font-semibold leading-8 text-[#17365f] sm:text-lg sm:leading-9">{article.paragraphs[0]}</p>
            <div className="mt-7 space-y-6 hyphens-auto text-justify text-[1rem] leading-8 text-slate-700 sm:mt-8 sm:text-[1.04rem] sm:leading-[2.05rem]">
              {article.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className="mt-9 border-l-4 border-[#FEC228] pl-4 text-base font-extrabold leading-7 text-[#001E4A] sm:mt-10 sm:pl-5 sm:text-lg">{article.signature}</p>
          </div>

          <aside className="lg:col-start-2 xl:col-start-auto">
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
