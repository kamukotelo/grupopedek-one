import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Car,
  CheckCircle2,
  Clock3,
  Eye,
  Headphones,
  HeartHandshake,
  Languages,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const leadership = [
  ['Pedro Kilombo', 'CEO'],
  ['Elizet Kilombo', 'about.roleAdministration'],
  ['Valeriano Venâncio', 'about.roleGeneralDirector'],
  ['Hélio Gorgel', 'about.roleFleet'],
  ['Nair Paim', 'about.roleSouth'],
  ['Luísa Cangalelo', 'about.rolePeople'],
  ['Ruth Chilembo', 'about.roleMarketing'],
  ['Maria Luísa Capingano', 'about.roleExecutiveAssistant'],
] as const;

const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplay(value);
        return;
      }
      const startedAt = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>+{display}{suffix}</span>;
};

export const About: React.FC = () => {
  const { t } = useTranslation();

  const principles = [
    ['about.principle1Title', 'about.principle1Desc', HeartHandshake],
    ['about.principle2Title', 'about.principle2Desc', Eye],
    ['about.principle3Title', 'about.principle3Desc', ShieldCheck],
    ['about.principle4Title', 'about.principle4Desc', Leaf],
  ] as const;

  const support = [
    ['about.support1Title', 'about.support1Desc', Languages],
    ['about.support2Title', 'about.support2Desc', Headphones],
    ['about.support3Title', 'about.support3Desc', Clock3],
  ] as const;

  const stats = [
    [10, '', 'about.statExperience', Award],
    [500, '', 'about.statClients', BriefcaseBusiness],
    [25, '', 'about.statBrands', Car],
    [24, '/7', 'about.statSupport', Clock3],
  ] as const;

  return (
    <section id="sobre" className="bg-white">
      <div className="relative overflow-hidden bg-[#001E4A] text-white">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_78%_28%,#236199_0,transparent_34%),linear-gradient(120deg,transparent_45%,#FEC228_140%)]" />
        <div className="container-pepek relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FEC228]/40 bg-[#FEC228]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#FEC228]">
              <Sparkles className="h-4 w-4" /> {t('about.tag')}
            </div>
            <h1 style={{ color: '#fff' }} className="max-w-5xl text-4xl font-extrabold leading-[1.04] sm:text-6xl lg:text-6xl">
              {t('about.heroTitle')}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              {t('about.heroDesc')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/reservar" className="inline-flex items-center gap-2 rounded-lg bg-[#FEC228] px-6 py-3.5 text-sm font-extrabold text-[#09172C] transition hover:bg-[#E4AD28]">
                {t('about.cta')} <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white/85">
                <MapPin className="h-4 w-4 text-[#FEC228]" /> {t('about.coverage')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-[#F5F6F6] py-12 sm:py-16">
        <div className="container-pepek grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, suffix, label, Icon]) => (
            <article key={label} className="group flex min-h-40 items-center gap-5 rounded-2xl bg-white p-7 shadow-[0_10px_28px_rgba(9,23,44,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(9,23,44,.1)]">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#236199]/10 text-[#236199] transition duration-500 group-hover:rotate-6 group-hover:bg-[#FEC228] group-hover:text-[#09172C]">
                <Icon className="h-8 w-8 stroke-[1.8]" />
              </div>
              <div>
                <strong className="block text-3xl font-extrabold leading-none text-[#09172C] sm:text-4xl"><AnimatedNumber value={value} suffix={suffix} /></strong>
                <span className="mt-2 block text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[#555B64]">{t(label)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container-pepek py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#236199]">{t('about.storyTag')}</span>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-[#09172C] sm:text-5xl">{t('about.title')}</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              {[t('about.check1'), t('about.check2')].map((item) => (
                <div key={item} className="flex gap-3 rounded-xl bg-[#F5F6F6] p-4 text-sm font-bold text-[#09172C]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#236199]" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid overflow-hidden rounded-2xl border border-slate-200 lg:grid-cols-3">
          {[
            ['about.mission', 'about.missionDesc', Target],
            ['about.vision', 'about.visionDesc', Eye],
            ['about.promise', 'about.promiseDesc', ShieldCheck],
          ].map(([title, desc, Icon], index) => (
            <article key={title as string} className={`p-8 sm:p-10 ${index === 1 ? 'bg-[#09172C] text-white' : 'bg-[#F5F6F6] text-[#09172C]'}`}>
              <Icon className={`h-8 w-8 ${index === 1 ? 'text-[#FEC228]' : 'text-[#236199]'}`} />
              <h3 style={index === 1 ? { color: '#fff' } : undefined} className="mt-8 text-2xl font-extrabold">{t(title as string)}</h3>
              <p className={`mt-4 text-sm leading-7 ${index === 1 ? 'text-white/70' : 'text-slate-600'}`}>{t(desc as string)}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 py-16 sm:py-24">
        <div className="container-pepek">
          <div className="max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#236199]">{t('about.principlesTag')}</span>
            <h2 className="mt-4 text-3xl font-extrabold text-[#09172C] sm:text-5xl">{t('about.principlesTitle')}</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(([title, desc, Icon]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-[#236199]/30 hover:shadow-xl hover:shadow-blue-950/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#236199]"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-6 text-lg font-extrabold text-[#09172C]">{t(title)}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{t(desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container-pepek py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#236199]">{t('about.supportTag')}</span>
            <h2 className="mt-4 text-3xl font-extrabold text-[#09172C] sm:text-5xl">{t('about.supportTitle')}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{t('about.supportIntro')}</p>
          </div>
          <div className="grid gap-4">
            {support.map(([title, desc, Icon]) => (
              <div key={title} className="flex gap-5 rounded-2xl border border-slate-200 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#09172C] text-[#FEC228]"><Icon className="h-6 w-6" /></div>
                <div><h3 className="font-extrabold text-[#09172C]">{t(title)}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{t(desc)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#001E4A] py-16 text-white sm:py-24">
        <div className="container-pepek">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FEC228]">{t('about.teamTag')}</span><h2 style={{ color: '#fff' }} className="mt-4 text-3xl font-extrabold sm:text-5xl">{t('about.teamTitle')}</h2></div>
            <p className="max-w-xl text-sm leading-7 text-white/65">{t('about.teamIntro')}</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
            <figure className="group relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-[#174B86] shadow-2xl shadow-black/20 sm:min-h-[28rem]">
              <img
                src="/institutional/direcao-pepek-2026.jpg"
                alt={t('about.leadershipPhotoAlt')}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09172C] via-[#09172C]/70 to-transparent px-6 pb-6 pt-20">
                <figcaption className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#FEC228]">{t('about.leadershipPhotoLabel')}</figcaption>
              </div>
            </figure>
            <figure className="group relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-[#174B86] shadow-2xl shadow-black/20 sm:min-h-[28rem]">
              <img
                src="/institutional/equipa-lideranca-pepek-2026.jpg"
                alt={t('about.teamPhotoAlt')}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09172C] via-[#09172C]/70 to-transparent px-6 pb-6 pt-20">
                <figcaption className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#FEC228]">{t('about.teamPhotoLabel')}</figcaption>
              </div>
            </figure>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map(([name, role]) => (
              <div key={name} className="bg-[#174B86] p-6">
                <Users className="h-5 w-5 text-[#FEC228]" />
                <h3 style={{ color: '#fff' }} className="mt-5 font-extrabold">{name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/50">{role === 'CEO' ? role : t(role)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
