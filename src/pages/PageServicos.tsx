import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Briefcase } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { Services } from '../components/sections/Services';
import { Process } from '../components/sections/Process';
import { FAQ, type FaqItem } from '../components/sections/FAQ';
import { BrandCTA } from '../components/sections/BrandCTA';

export const PageServicos: React.FC = () => {
  const { t } = useTranslation();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: 'https://pepekgrupo.com/servicos',
    mainEntity: (t('faq.items', { returnObjects: true }) as FaqItem[]).map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{t('pages.servicos.metaTitle')}</title>
        <meta name="description" content={t('pages.servicos.metaDescription')} />
        <meta property="og:title" content={t('pages.servicos.ogTitle')} />
        <meta property="og:description" content={t('pages.servicos.ogDescription')} />
        <meta property="og:url" content="https://pepekgrupo.com/servicos" />
        <link rel="canonical" href="https://pepekgrupo.com/servicos" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: t('pages.servicos.schemaName'),
          url: 'https://pepekgrupo.com/servicos',
          itemListElement: (t('pages.servicos.schemaServices', { returnObjects: true }) as string[]).map((name, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', name } })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <PageHero
        icon={Briefcase}
        eyebrow={t('pages.servicos.eyebrow')}
        title={t('pages.servicos.title')}
        description={t('pages.servicos.description')}
        breadcrumb={[{ label: t('nav.services') }]}
      />

      <Services withLinks={false} />
      <Process />
      <FAQ />
      <BrandCTA />
    </>
  );
};
