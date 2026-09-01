import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CalendarDays, Mail, Newspaper, PlayCircle } from 'lucide-react';

const stories = [
  { video: '/videos/pepek-african-sezs-2-web.mp4', tag: 'Parcerias', title: 'PEPEK e African SEZs: mobilidade que acompanha o investimento', text: 'Bastidores de uma parceria orientada para negócios, protocolo e deslocações executivas em Angola.' },
  { video: '/videos/pepek-argentina-4-web.mp4', tag: 'Protocolo', title: 'Mobilidade internacional com padrão PEPEK', text: 'Coordenação de viaturas, equipas e horários para missões que exigem discrição e rigor.' },
  { video: '/videos/pepek-african-sezs-1-web.mp4', tag: 'Experiência', title: 'Por dentro da operação PEPEK', text: 'Conheça momentos reais do serviço que move empresas, delegações e clientes particulares.' },
  { video: '/videos/img-1872-web.mp4', tag: 'Frota', title: 'Viaturas preparadas para cada percurso', text: 'Conforto, apresentação e segurança antes de cada levantamento ou transfer.' },
];

export const PageBlog: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <>
      <Helmet>
        <title>Blogue & Newsletter | PEPEK GRUPO</title>
        <meta name="description" content="Notícias, vídeos e novidades sobre mobilidade executiva, frota e operações PEPEK em Angola." />
        <link rel="canonical" href="https://pepekgrupo.com/blogue" />
      </Helmet>
      <main className="bg-[#F5F6F6] pt-28 text-[#09172C]">
        <section className="overflow-hidden bg-[#001E4A] py-16 text-white sm:py-24">
          <div className="container-pepek grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#FEC228]"><Newspaper className="h-4 w-4" /> Blogue PEPEK</span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight !text-white sm:text-6xl">Histórias que movem Angola.</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">Novidades da frota, bastidores das nossas operações e informação útil para planear viagens, transfers e missões corporativas.</p>
            </div>
            <form onSubmit={subscribe} className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8">
              <Mail className="h-8 w-8 text-[#FEC228]" />
              <h2 className="mt-4 text-2xl font-extrabold !text-white">Receba a Newsletter PEPEK</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Novidades, serviços e oportunidades diretamente no seu e-mail.</p>
              {subscribed ? <p className="mt-6 rounded-xl bg-emerald-500/20 p-4 font-bold text-emerald-200">Subscrição registada. Obrigado por acompanhar a PEPEK.</p> : <div className="mt-6 flex flex-col gap-3 sm:flex-row"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O seu endereço de e-mail" className="min-h-12 flex-1 rounded-xl border border-white/20 bg-white px-4 text-sm text-[#09172C] outline-none focus:ring-2 focus:ring-[#FEC228]" /><button type="submit" className="min-h-12 rounded-xl bg-[#FEC228] px-5 text-sm font-extrabold text-[#09172C]">Subscrever</button></div>}
              <p className="mt-3 text-[11px] text-white/45">Ao subscrever, aceita receber comunicações PEPEK. Pode cancelar quando desejar.</p>
            </form>
          </div>
        </section>

        <section className="container-pepek py-16 sm:py-20">
          <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">Vídeos & notícias</span><h2 className="mt-2 text-3xl font-black sm:text-4xl">Últimas histórias</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">Conteúdo original PEPEK sobre mobilidade, parcerias e experiências em Angola.</p></div>
          <div className="grid gap-7 md:grid-cols-2">
            {stories.map((story, index) => <article key={story.video} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(9,23,44,.10)]">
              <div className="relative aspect-video bg-[#09172C]"><video className="h-full w-full object-cover" controls preload={index === 0 ? 'metadata' : 'none'} playsInline><source src={story.video} /></video><span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#001E4A]/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FEC228]"><PlayCircle className="h-3.5 w-3.5" /> Vídeo PEPEK</span></div>
              <div className="p-6 sm:p-7"><div className="flex items-center justify-between gap-3 text-xs font-bold text-[#236199]"><span>{story.tag}</span><span className="flex items-center gap-1 text-slate-500"><CalendarDays className="h-3.5 w-3.5" /> Atualidade PEPEK</span></div><h3 className="mt-3 text-2xl font-extrabold leading-tight">{story.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{story.text}</p><button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#174B86]">Acompanhar novidades <ArrowRight className="h-4 w-4" /></button></div>
            </article>)}
          </div>
        </section>
      </main>
    </>
  );
};
