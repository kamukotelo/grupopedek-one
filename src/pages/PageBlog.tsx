import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CalendarCheck, Car, Check, Clock3, Mail, MapPinned, Newspaper, PlayCircle, Search, Share2 } from 'lucide-react';

type Story = { id: string; video: string; tag: 'Parcerias' | 'Protocolo' | 'Experiência' | 'Frota'; title: string; text: string; duration: string; audience: string };

const stories: Story[] = [
  { id: 'african-sezs-mobilidade', video: '/videos/pepek-african-sezs-2-web.mp4', tag: 'Parcerias', title: 'PEPEK e African SEZs: mobilidade que acompanha o investimento', text: 'Bastidores de uma parceria orientada para negócios, protocolo e deslocações executivas em Angola.', duration: '1 min', audience: 'Empresas e delegações' },
  { id: 'mobilidade-internacional', video: '/videos/pepek-argentina-4-web.mp4', tag: 'Protocolo', title: 'Mobilidade internacional com padrão PEPEK', text: 'Coordenação de viaturas, equipas e horários para missões que exigem discrição e rigor.', duration: '1 min', audience: 'Missões e protocolo' },
  { id: 'operacao-pepek', video: '/videos/pepek-african-sezs-1-web.mp4', tag: 'Experiência', title: 'Por dentro da operação PEPEK', text: 'Conheça momentos reais do serviço que move empresas, delegações e clientes particulares.', duration: '1 min', audience: 'Clientes PEPEK' },
  { id: 'viaturas-preparadas', video: '/videos/img-1872-web.mp4', tag: 'Frota', title: 'Viaturas preparadas para cada percurso', text: 'Conforto, apresentação e segurança antes de cada levantamento ou transfer.', duration: '1 min', audience: 'Particulares e empresas' },
];

const categories = ['Todos', 'Parcerias', 'Protocolo', 'Experiência', 'Frota'] as const;
const resources = [
  { icon: Car, title: 'Escolher uma viatura', text: 'Compare categorias, lugares e tarifas da frota oficial.', to: '/frota', action: 'Ver frota' },
  { icon: MapPinned, title: 'Planear um percurso', text: 'Consulte soluções de transfer em Luanda e noutras províncias.', to: '/rotas', action: 'Explorar rotas' },
  { icon: CalendarCheck, title: 'Preparar uma reserva', text: 'Indique datas, localidades e necessidades da sua viagem.', to: '/reservar', action: 'Reservar' },
];

export const PageBlog: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Todos');
  const [query, setQuery] = useState('');
  const [copiedStory, setCopiedStory] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt');
    return stories.filter((story) => {
      const inCategory = activeCategory === 'Todos' || story.tag === activeCategory;
      const content = `${story.title} ${story.text} ${story.tag} ${story.audience}`.toLocaleLowerCase('pt');
      return inCategory && (!term || content.includes(term));
    });
  }, [activeCategory, query]);

  const subscribe = (event: React.FormEvent) => { event.preventDefault(); if (email.trim()) setSubscribed(true); };
  const shareStory = async (story: Story) => {
    const url = `${window.location.origin}/blogue#${story.id}`;
    try {
      if (navigator.share) return void await navigator.share({ title: story.title, text: story.text, url });
      await navigator.clipboard.writeText(url);
      setCopiedStory(story.id);
      window.setTimeout(() => setCopiedStory(null), 2200);
    } catch { /* O cancelamento da partilha não deve interromper a página. */ }
  };

  const structuredData = { '@context': 'https://schema.org', '@type': 'Blog', name: 'Blogue PEPEK', url: 'https://pepekgrupo.com/blogue', description: 'Notícias, vídeos e guias de mobilidade PEPEK em Angola.', publisher: { '@type': 'Organization', name: 'PEPEK GRUPO' }, blogPost: stories.map((story) => ({ '@type': 'BlogPosting', headline: story.title, description: story.text, articleSection: story.tag })) };

  return <>
    <Helmet>
      <title>Blogue & Newsletter | PEPEK GRUPO</title>
      <meta name="description" content="Notícias, vídeos e guias sobre mobilidade executiva, frota e operações PEPEK em Angola." />
      <link rel="canonical" href="https://pepekgrupo.com/blogue" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
    <main className="bg-[#F5F6F6] pt-28 text-[#09172C]">
      <section className="overflow-hidden bg-[#001E4A] py-16 text-white sm:py-24">
        <div className="container-pepek grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#FEC228]"><Newspaper className="h-4 w-4" /> Blogue PEPEK</span>
            <h1 className="max-w-3xl text-4xl font-black leading-tight !text-white sm:text-6xl">Histórias que movem Angola.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">Novidades da frota, bastidores das nossas operações e informação útil para planear viagens, transfers e missões corporativas.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-white/80"><span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Vídeos originais</span><span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Guias práticos</span><span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Atualidade PEPEK</span></div>
          </div>
          <form onSubmit={subscribe} className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <Mail className="h-8 w-8 text-[#FEC228]" /><h2 className="mt-4 text-2xl font-extrabold !text-white">Receba a Newsletter PEPEK</h2><p className="mt-2 text-sm leading-6 text-white/65">Uma seleção breve de novidades, serviços e oportunidades, diretamente no seu e-mail.</p>
            {subscribed ? <div className="mt-6 rounded-xl bg-emerald-500/20 p-4 text-emerald-100" role="status"><p className="flex items-center gap-2 font-bold"><Check className="h-5 w-5" /> Subscrição registada</p><p className="mt-1 text-xs text-emerald-100/75">Obrigado por acompanhar a PEPEK.</p></div> : <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label htmlFor="newsletter-email" className="sr-only">Endereço de e-mail</label><input id="newsletter-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="O seu endereço de e-mail" className="min-h-12 flex-1 rounded-xl border border-white/20 bg-white px-4 text-sm text-[#09172C] outline-none focus:ring-2 focus:ring-[#FEC228]" /><button type="submit" className="min-h-12 rounded-xl bg-[#FEC228] px-5 text-sm font-extrabold text-[#09172C] transition hover:bg-[#FFD45F]">Subscrever</button></div>}
            <p className="mt-3 text-[11px] text-white/45">Ao subscrever, aceita receber comunicações PEPEK. Pode cancelar quando desejar.</p>
          </form>
        </div>
      </section>

      <section className="container-pepek py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">Vídeos & notícias</span><h2 className="mt-2 text-3xl font-black sm:text-4xl">Explore as últimas histórias</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">Encontre rapidamente conteúdos sobre a frota, experiências, protocolo e parcerias.</p></div>
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><label htmlFor="blog-search" className="sr-only">Pesquisar no blogue</label><input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por tema, serviço ou experiência" className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none focus:border-[#236199] focus:ring-2 focus:ring-[#236199]/20" /></div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar conteúdos por tema">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition focus:ring-2 focus:ring-[#236199] ${activeCategory === category ? 'bg-[#001E4A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{category}</button>)}</div>
        </div>
        {filteredStories.length ? <div className="grid gap-7 md:grid-cols-2">{filteredStories.map((story, index) => <article id={story.id} key={story.video} className="scroll-mt-32 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(9,23,44,.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(9,23,44,.16)]">
          <div className="relative aspect-video bg-[#09172C]"><video className="h-full w-full object-cover" controls preload={index === 0 ? 'metadata' : 'none'} playsInline aria-label={`Vídeo: ${story.title}`}><source src={story.video} type="video/mp4" /></video><span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#001E4A]/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FEC228]"><PlayCircle className="h-3.5 w-3.5" /> Vídeo PEPEK</span></div>
          <div className="p-6 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#236199]"><span>{story.tag}</span><span className="flex items-center gap-1 text-slate-500"><Clock3 className="h-3.5 w-3.5" /> {story.duration}</span></div><h3 className="mt-3 text-2xl font-extrabold leading-tight">{story.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{story.text}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><span className="text-xs font-semibold text-slate-500">Para: {story.audience}</span><button type="button" onClick={() => void shareStory(story)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-extrabold text-[#174B86] hover:bg-blue-50"><Share2 className="h-4 w-4" /> {copiedStory === story.id ? 'Ligação copiada' : 'Partilhar'}</button></div></div>
        </article>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center" role="status"><Search className="mx-auto h-9 w-9 text-slate-400" /><h3 className="mt-4 text-xl font-extrabold">Nenhum conteúdo encontrado</h3><p className="mt-2 text-sm text-slate-600">Experimente outro termo ou volte a mostrar todos os temas.</p><button type="button" onClick={() => { setQuery(''); setActiveCategory('Todos'); }} className="mt-5 rounded-xl bg-[#001E4A] px-5 py-3 text-sm font-extrabold text-white">Limpar pesquisa</button></div>}
      </section>

      <section className="bg-white py-16 sm:py-20"><div className="container-pepek"><div className="max-w-2xl"><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">Recursos úteis</span><h2 className="mt-2 text-3xl font-black sm:text-4xl">Da inspiração ao próximo percurso</h2><p className="mt-3 text-sm leading-7 text-slate-600">Use estes atalhos para transformar a informação do blogue numa decisão de mobilidade.</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">{resources.map(({ icon: Icon, title, text, to, action }) => <Link key={to} to={to} className="group rounded-3xl border border-slate-200 bg-[#F8F9FA] p-6 transition hover:-translate-y-1 hover:border-[#FEC228] hover:shadow-lg"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001E4A] text-[#FEC228]"><Icon className="h-6 w-6" /></span><h3 className="mt-5 text-xl font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#174B86]">{action} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></div></section>

      <section className="container-pepek py-16 sm:py-20"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">Guias rápidos</span><h2 className="mt-2 text-3xl font-black">Informação para decidir melhor</h2><p className="mt-3 text-sm leading-7 text-slate-600">Respostas simples às dúvidas mais comuns antes de uma reserva.</p></div><div className="space-y-3">
        <details className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]"><summary className="cursor-pointer font-extrabold">Como escolher a viatura certa?</summary><p className="mt-3 text-sm leading-7 text-slate-600">Considere passageiros, bagagem, percurso e nível de representação. Para delegações, confirme também motorista e apoio de protocolo.</p></details>
        <details className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]"><summary className="cursor-pointer font-extrabold">A recolha ou entrega pode ser fora de Luanda?</summary><p className="mt-3 text-sm leading-7 text-slate-600">Sim. Indique a província, município e referência no pedido. A equipa confirma disponibilidade, logística e eventual ajuste de tarifa.</p></details>
        <details className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]"><summary className="cursor-pointer font-extrabold">Existe atendimento para empresas?</summary><p className="mt-3 text-sm leading-7 text-slate-600">Sim. A PEPEK apoia mobilidade corporativa, missões, eventos e delegações com planeamento dedicado.</p></details>
      </div></div><div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#001E4A] p-7 text-white sm:flex-row sm:items-center sm:p-9"><div><div className="flex items-center gap-2 text-[#FEC228]"><Building2 className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-wider">Atendimento especializado</span></div><h2 className="mt-2 text-2xl font-black !text-white">Precisa de apoio para organizar a mobilidade?</h2><p className="mt-2 text-sm text-white/65">A nossa equipa ajuda a definir viaturas, rotas e horários.</p></div><Link to="/contactos" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#FEC228] px-5 text-sm font-extrabold text-[#09172C] hover:bg-[#FFD45F]">Falar com a PEPEK <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  </>;
};
