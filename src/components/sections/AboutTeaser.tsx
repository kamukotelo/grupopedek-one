import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, HeartHandshake, ShieldCheck } from 'lucide-react';

const values = [
  ['about.val1Title', 'about.val1Desc', ShieldCheck],
  ['about.val2Title', 'about.val2Desc', HeartHandshake],
  ['about.val3Title', 'about.val3Desc', Eye],
] as const;

/**
 * Resumo institucional da home. A história completa, princípios, equipa e
 * liderança vivem em /quem-somos — aqui fica apenas a porta de entrada.
 */
export const AboutTeaser: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="sobre" className="bg-white py-16 sm:py-20">
      <div className="container-pepek grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#236199]">{t('about.storyTag')}</span>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-[#09172C] sm:text-4xl">{t('about.title')}</h2>
          <p className="mt-6 text-base leading-8 text-slate-600">{t('about.p1')}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[t('about.check1'), t('about.check2')].map((item) => (
              <div key={item} className="flex gap-3 rounded-xl bg-[#F5F6F6] p-4 text-sm font-bold text-[#09172C]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#236199]" /> {item}
              </div>
            ))}
          </div>

          <Link
            to="/quem-somos"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-[#001E4A] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#001E4A] transition hover:bg-[#001E4A] hover:text-white"
          >
            {t('nav.about')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          {values.map(([title, desc, Icon]) => (
            <article key={title} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(9,23,44,.05)] transition duration-300 hover:-translate-y-1 hover:border-[#236199]/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#236199]/10 text-[#236199]">
                <Icon className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#09172C]">{t(title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(desc)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
