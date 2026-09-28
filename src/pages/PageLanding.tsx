import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Car, CheckCircle2, Crown, MapPin, MessageCircle, Plane, UserRound, Bus, type LucideIcon } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { BrandCTA } from '../components/sections/BrandCTA';
import { PUBLIC_FLEET } from '../data/fleetFlyer2026';
import { getFleetCarouselScale, getVehicleStudioBackground } from '../data/fleetPresentation';
import { LANDING_LABELS, LANDING_PAGES, findLandingPage, toLandingLang, type LandingIcon, type LandingPage } from '../data/seoLandingPages';
import { landingLinkLabel } from '../data/seoLandingLinks';
import { generateQuickWhatsAppUrl } from '../lib/whatsapp';
import { SITE_URL, ORGANIZATION_ID } from '../lib/seo';

const ICONS: Record<LandingIcon, LucideIcon> = {
  car: Car,
  chauffeur: UserRound,
  plane: Plane,
  crown: Crown,
  van: Bus,
  map: MapPin,
  building: Building2,
};

// Mesmo formato do catálogo ("119.999 Kz"), independente do motor Intl do browser/Node.
const formatKz = (value: number) => `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Kz`;

const vehiclesFor = (page: LandingPage) =>
  page.vehicleIds.flatMap((id) => PUBLIC_FLEET.find((vehicle) => vehicle.id === id) ?? []);

const priceOf = (page: LandingPage, vehicle: (typeof PUBLIC_FLEET)[number]) =>
  page.priceMode === 'transfer' ? vehicle.transferPriceAOA : vehicle.pricePerDayAOA;

export const PageLanding: React.FC<{ slug: string }> = ({ slug }) => {
  const { i18n } = useTranslation();
  const page = findLandingPage(slug);
  if (!page) return null;

  const lang = toLandingLang(i18n.resolvedLanguage ?? i18n.language);
  const labels = LANDING_LABELS[lang];
  const vehicles = vehiclesFor(page);
  const prices = vehicles.map((vehicle) => priceOf(page, vehicle)).filter((price): price is number => typeof price === 'number' && price > 0);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);
  const fill = (text: string) => text.split('{{from}}').join(formatKz(lowPrice));
  const copy = page.copy[lang];
  const url = `${SITE_URL}/${page.slug}`;
  const Icon = ICONS[page.icon];
  const linkLabel = landingLinkLabel(page.slug, lang);
  const priceSuffix = page.priceMode === 'transfer' ? labels.perTransfer : labels.perDay;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: fill(copy.h1),
    serviceType: page.serviceType,
    description: fill(copy.metaDescription),
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: page.areaServed.map((name) => ({ '@type': 'Place', name })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'AOA',
      lowPrice: Math.round(lowPrice),
      highPrice: Math.round(highPrice),
      offerCount: vehicles.length,
      availability: 'https://schema.org/InStock',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: copy.fleetTitle,
      itemListElement: vehicles.map((vehicle) => ({
        '@type': 'Offer',
        priceCurrency: 'AOA',
        price: Math.round(priceOf(page, vehicle) ?? 0),
        itemOffered: {
          '@type': 'Car',
          name: vehicle.name,
          brand: vehicle.brand ? { '@type': 'Brand', name: vehicle.brand } : undefined,
          image: `${SITE_URL}${vehicle.primaryImage}`,
        },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity: copy.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: fill(q),
      acceptedAnswer: { '@type': 'Answer', text: fill(a) },
    })),
  };

  const related = page.related.flatMap((relatedSlug) => LANDING_PAGES.find((item) => item.slug === relatedSlug) ?? []);

  return (
    <>
      <Helmet>
        <title>{fill(copy.metaTitle)}</title>
        <meta name="description" content={fill(copy.metaDescription)} />
        <meta property="og:title" content={fill(copy.metaTitle)} />
        <meta property="og:description" content={fill(copy.metaDescription)} />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <PageHero
        icon={Icon}
        eyebrow={copy.eyebrow}
        title={copy.h1}
        description={fill(copy.lead)}
        breadcrumb={[{ label: linkLabel }]}
        highlights={copy.highlights}
      />

      <section className="container-pepek py-14 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/reservar" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FEC228] px-6 text-sm font-extrabold uppercase text-[#09172C] hover:bg-[#FFD45F]">
            {labels.book} <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={generateQuickWhatsAppUrl(linkLabel)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#001E4A]/15 bg-white px-6 text-sm font-extrabold text-[#001E4A] hover:border-[#25D366]">
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> {labels.whatsapp}
          </a>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {copy.sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#001E4A]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{fill(section.body)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F4F6FA] py-14 sm:py-16">
        <div className="container-pepek">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-2xl font-extrabold text-[#001E4A] sm:text-3xl">{copy.fleetTitle}</h2>
            <Link to="/frota" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#174B86] hover:text-[#001E4A]">
              {labels.viewFleet} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex h-40 items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}>
                  <img
                    src={vehicle.primaryImage}
                    alt={vehicle.name}
                    loading="lazy"
                    decoding="async"
                    style={{ '--fleet-image-scale': getFleetCarouselScale(vehicle.id) } as React.CSSProperties}
                    className="fleet-vehicle-image is-carousel h-full w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-extrabold text-[#001E4A]">{vehicle.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {labels.from} <strong className="text-[#001E4A]">{formatKz(priceOf(page, vehicle) ?? 0)}</strong>{priceSuffix}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-pepek py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-[#001E4A] sm:text-3xl">{labels.faqTitle}</h2>
            <div className="mt-6 space-y-3">
              {copy.faq.map(({ q, a }) => (
                <details key={q} className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]">
                  <summary className="cursor-pointer font-extrabold text-[#001E4A]">{fill(q)}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{fill(a)}</p>
                </details>
              ))}
            </div>
          </div>
          <aside>
            <h2 className="text-xl font-extrabold text-[#001E4A]">{labels.relatedTitle}</h2>
            <ul className="mt-6 space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={`/${item.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#174B86] hover:border-[#FEC228]">
                    <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#E4AD28]" />{landingLinkLabel(item.slug, lang)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <BrandCTA />
    </>
  );
};
