import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, LockKeyhole, Clock3, UserRoundCheck } from 'lucide-react';

const PRINCIPLE_ICONS = [UserRoundCheck, LockKeyhole, Clock3];

export const PagePrivacidade: React.FC = () => {
  const { t } = useTranslation();
  const principles = (t('pages.privacidade.principles', { returnObjects: true }) as { title: string; text: string }[])
    .map(({ title, text }, index) => [title, text, PRINCIPLE_ICONS[index]] as const);

  return (
    <>
      <Helmet>
        <title>{t('pages.privacidade.metaTitle')}</title>
        <meta name="description" content={t('pages.privacidade.metaDescription')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://pepekgrupo.com/privacidade" />
      </Helmet>
      <section className="bg-[#F5F6F6] py-28 sm:py-32">
        <div className="container-pepek max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#236199]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#09172C]"><ShieldCheck className="h-4 w-4 text-[#E4AD28]" /> {t('pages.privacidade.eyebrow')}</span>
          <h1 className="mt-6 max-w-3xl text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09172C]">{t('pages.privacidade.title')}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">{t('pages.privacidade.intro')}</p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map(([title, text, Icon]) => {
              const PrincipleIcon = Icon as typeof ShieldCheck;
              return <article key={title as string} className="rounded-2xl border border-[#236199]/15 bg-white p-6 shadow-sm"><PrincipleIcon className="h-7 w-7 text-[#E4AD28]" /><h2 className="mt-5 text-lg font-extrabold text-[#09172C]">{title as string}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">{text as string}</p></article>;
            })}
          </div>

          <div className="mt-10 rounded-2xl bg-[#001E4A] p-7 text-white sm:p-9">
            <h2 className="text-2xl font-extrabold">{t('pages.privacidade.secureChannels')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">{t('pages.privacidade.channelsText')} <a className="font-bold text-[#FEC228] hover:underline" href="mailto:geral@pepekgrupo.com">geral@pepekgrupo.com</a>.</p>
            <p className="mt-5 text-xs leading-relaxed text-white/55">{t('pages.privacidade.disclaimer')}</p>
          </div>
          <Link to="/contactos" className="mt-8 inline-flex rounded-xl bg-[#FEC228] px-5 py-3 text-sm font-extrabold text-[#09172C] transition hover:bg-[#FFD45F]">{t('pages.privacidade.talkToTeam')}</Link>
        </div>
      </section>
    </>
  );
};
