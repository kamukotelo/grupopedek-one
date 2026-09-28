import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_VIDEOS, type SiteVideo, type SiteVideoId } from '../data/siteVideos';
import { StreamVideo } from '../components/ui/StreamVideo';
import { ArrowRight, Building2, CalendarCheck, Car, Check, Clock3, MapPinned, PlayCircle, Search, Share2 } from 'lucide-react';

type StoryTag = 'partnerships' | 'protocol' | 'experience';
type Story = { id: SiteVideoId; video: SiteVideo; tag: StoryTag; title: string; text: string; duration: string; audience: string };

// Os textos de cada história vivem em blog.stories.<id> nos ficheiros de tradução.
const STORY_SOURCES: { id: SiteVideoId; video: SiteVideo; tag: StoryTag }[] = [
  { id: 'african-sezs-mobilidade', video: SITE_VIDEOS['african-sezs-mobilidade'], tag: 'partnerships' },
  { id: 'mobilidade-internacional', video: SITE_VIDEOS['mobilidade-internacional'], tag: 'protocol' },
  { id: 'operacao-pepek', video: SITE_VIDEOS['operacao-pepek'], tag: 'experience' },
  { id: 'viaturas-preparadas', video: SITE_VIDEOS['viaturas-preparadas'], tag: 'partnerships' },
  { id: 'hyundai-staria-vip', video: SITE_VIDEOS['hyundai-staria-vip'], tag: 'experience' },
];

const categories = ['all', 'partnerships', 'protocol', 'experience'] as const;
const RESOURCE_SOURCES = [
  { icon: Car, key: 'fleet', to: '/frota' },
  { icon: MapPinned, key: 'routes', to: '/rotas' },
  { icon: CalendarCheck, key: 'booking', to: '/reservar' },
];

export const PageBlog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const stories: Story[] = useMemo(() => STORY_SOURCES.map((source) => ({
    ...source,
    title: t(`blog.stories.${source.id}.title`),
    text: t(`blog.stories.${source.id}.text`),
    duration: t(`blog.stories.${source.id}.duration`),
    audience: t(`blog.stories.${source.id}.audience`),
  })), [t]);
  const resources = RESOURCE_SOURCES.map((resource) => ({
    ...resource,
    title: t(`blog.resources.${resource.key}.title`),
    text: t(`blog.resources.${resource.key}.text`),
    action: t(`blog.resources.${resource.key}.action`),
  }));
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('all');
  const [query, setQuery] = useState('');
  const [copiedStory, setCopiedStory] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    const term = query.trim().toLocaleLowerCase(i18n.language);
    return stories.filter((story) => {
      const inCategory = activeCategory === 'all' || story.tag === activeCategory;
      const content = `${story.title} ${story.text} ${t(`blog.categories.${story.tag}`)} ${story.audience}`.toLocaleLowerCase(i18n.language);
      return inCategory && (!term || content.includes(term));
    });
  }, [activeCategory, query, stories, t, i18n.language]);

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

  const structuredData = { '@context': 'https://schema.org', '@type': 'Blog', name: t('blog.label'), url: 'https://pepekgrupo.com/blogue', description: t('blog.schemaDescription'), publisher: { '@type': 'Organization', name: 'PEPEK GRUPO' }, blogPost: stories.map((story) => ({ '@type': 'BlogPosting', headline: story.title, description: story.text, articleSection: story.tag })) };

  return <>
    <Helmet>
      <title>{t('blog.metaTitle')}</title>
      <meta name="description" content={t('blog.metaDescription')} />
      <link rel="canonical" href="https://pepekgrupo.com/blogue" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
    <main className="bg-[#F5F6F6] pt-28 text-[#09172C]">
      <section className="overflow-hidden bg-[#001E4A] py-16 text-white sm:py-24">
        <div className="container-pepek grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="mb-5 inline-flex text-xs font-extrabold uppercase tracking-[.16em] text-[#FEC228]">{t('blog.label')}</span>
            <h1 className="max-w-3xl text-2xl sm:text-3xl font-extrabold leading-tight !text-white">{t('blog.title')}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">{t('blog.lead')}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{t('blog.tagline')}</p>
          </div>
          <form onSubmit={subscribe} className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-xl font-extrabold !text-white sm:text-2xl">{t('blog.newsletterTitle')}</h2><p className="mt-2 text-sm leading-6 text-white/65">{t('blog.newsletterText')}</p>
            {subscribed ? <div className="mt-6 rounded-xl bg-emerald-500/20 p-4 text-emerald-100" role="status"><p className="flex items-center gap-2 font-bold"><Check className="h-5 w-5" /> {t('blog.subscribed')}</p><p className="mt-1 text-xs text-emerald-100/75">{t('blog.thanks')}</p></div> : <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label htmlFor="newsletter-email" className="sr-only">{t('blog.emailLabel')}</label><input id="newsletter-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('blog.emailPlaceholder')} className="min-h-12 flex-1 rounded-xl border border-white/20 bg-white px-4 text-sm text-[#09172C] outline-none focus:ring-2 focus:ring-[#FEC228]" /><button type="submit" className="min-h-12 rounded-xl bg-[#FEC228] px-5 text-sm font-extrabold text-[#09172C] transition hover:bg-[#FFD45F]">{t('blog.subscribe')}</button></div>}
            <p className="mt-3 text-[11px] leading-5 text-white/50">{t('blog.consent')}</p>
          </form>
        </div>
      </section>

      <section className="container-pepek py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">{t('blog.newsEyebrow')}</span><h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">{t('blog.newsTitle')}</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">{t('blog.newsText')}</p></div>
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><label htmlFor="blog-search" className="sr-only">{t('blog.searchLabel')}</label><input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('blog.searchPlaceholder')} className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none focus:border-[#236199] focus:ring-2 focus:ring-[#236199]/20" /></div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label={t('blog.filterLabel')}>{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition focus:ring-2 focus:ring-[#236199] ${activeCategory === category ? 'bg-[#001E4A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t(`blog.categories.${category}`)}</button>)}</div>
        </div>
        {filteredStories.length ? <div className="grid gap-7 md:grid-cols-2">{filteredStories.map((story, index) => <article id={story.id} key={story.id} className="scroll-mt-32 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(9,23,44,.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(9,23,44,.16)]">
          <div className="relative aspect-video bg-[#09172C]"><StreamVideo className="h-full w-full object-cover" video={story.video} controls preload={index === 0 ? 'metadata' : 'none'} playsInline aria-label={t('blog.videoLabel', { title: story.title })} /><span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#001E4A]/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FEC228]"><PlayCircle className="h-3.5 w-3.5" /> {t('blog.videoBadge')}</span></div>
          <div className="p-6 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#236199]"><span>{t(`blog.categories.${story.tag}`)}</span><span className="flex items-center gap-1 text-slate-500"><Clock3 className="h-3.5 w-3.5" /> {story.duration}</span></div><h3 className="mt-3 text-2xl font-extrabold leading-tight">{story.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{story.text}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><span className="text-xs font-semibold text-slate-500">{t('blog.audience', { audience: story.audience })}</span><button type="button" onClick={() => void shareStory(story)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-extrabold text-[#174B86] hover:bg-blue-50"><Share2 className="h-4 w-4" /> {copiedStory === story.id ? t('blog.linkCopied') : t('blog.share')}</button></div></div>
        </article>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center" role="status"><Search className="mx-auto h-9 w-9 text-slate-400" /><h3 className="mt-4 text-xl font-extrabold">{t('blog.noResults')}</h3><p className="mt-2 text-sm text-slate-600">{t('blog.noResultsText')}</p><button type="button" onClick={() => { setQuery(''); setActiveCategory('all'); }} className="mt-5 rounded-xl bg-[#001E4A] px-5 py-3 text-sm font-extrabold text-white">{t('blog.clearSearch')}</button></div>}
      </section>

      <section className="bg-white py-16 sm:py-20"><div className="container-pepek"><div className="max-w-2xl"><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">{t('blog.resourcesEyebrow')}</span><h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">{t('blog.resourcesTitle')}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{t('blog.resourcesText')}</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">{resources.map(({ icon: Icon, title, text, to, action }) => <Link key={to} to={to} className="group rounded-3xl border border-slate-200 bg-[#F8F9FA] p-6 transition hover:-translate-y-1 hover:border-[#FEC228] hover:shadow-lg"><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001E4A] text-[#FEC228]"><Icon className="h-6 w-6" /></span><h3 className="mt-5 text-xl font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#174B86]">{action} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></div></section>

      <section className="container-pepek py-16 sm:py-20"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">{t('blog.guidesEyebrow')}</span><h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">{t('blog.guidesTitle')}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{t('blog.guidesText')}</p></div><div className="space-y-3">
        <details className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]"><summary className="cursor-pointer font-extrabold">{t('blog.guide1Q')}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{t('blog.guide1A')}</p></details>
        <details className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]"><summary className="cursor-pointer font-extrabold">{t('blog.guide2Q')}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{t('blog.guide2A')}</p></details>
        <details className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]"><summary className="cursor-pointer font-extrabold">{t('blog.guide3Q')}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{t('blog.guide3A')}</p></details>
      </div></div><div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#001E4A] p-7 text-white sm:flex-row sm:items-center sm:p-9"><div><div className="flex items-center gap-2 text-[#FEC228]"><Building2 className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-wider">{t('blog.specialistEyebrow')}</span></div><h2 className="mt-2 text-2xl sm:text-3xl font-extrabold !text-white">{t('blog.specialistTitle')}</h2><p className="mt-2 text-sm text-white/65">{t('blog.specialistText')}</p></div><Link to="/contactos" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#FEC228] px-5 text-sm font-extrabold text-[#09172C] hover:bg-[#FFD45F]">{t('blog.talkToPepek')} <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  </>;
};
