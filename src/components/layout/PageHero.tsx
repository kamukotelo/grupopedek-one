import React from 'react';
import { type LucideIcon } from 'lucide-react';

type Crumb = { label: string; to?: string };

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Trilho de navegação; "Início" é sempre adicionado à cabeça. */
  breadcrumb: Crumb[];
}

/**
 * Cabeçalho institucional partilhado pelas páginas internas.
 * Garante um único <h1> por página e um breadcrumb indexável (schema.org).
 */
export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, icon: Icon, breadcrumb }) => {
  const trail: Crumb[] = [{ label: 'Início', to: '/' }, ...breadcrumb];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.to ? { item: `https://pepekgrupo.com${crumb.to === '/' ? '' : crumb.to}` } : {}),
    })),
  };

  return (
    <section className="relative overflow-hidden bg-[#001E4A] pb-14 pt-32 text-white sm:pb-16 sm:pt-36 lg:pt-44">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_78%_28%,#236199_0,transparent_34%),linear-gradient(120deg,transparent_45%,#FEC228_140%)]"
      />

      <div className="container-pepek relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#FEC228]/40 bg-[#FEC228]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FEC228]">
          <Icon className="h-4 w-4" /> {eyebrow}
        </span>

        <h1 style={{ color: '#fff' }} className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">{description}</p>
      </div>

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </section>
  );
};
