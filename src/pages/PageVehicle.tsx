import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Car, CheckCircle2, MessageCircle } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { BrandCTA } from '../components/sections/BrandCTA';
import { PageNotFound } from './PageNotFound';
import { VEHICLE_COPY, VEHICLE_PAGES, findVehiclePage } from '../data/seoVehiclePages';
import { LANDING_LABELS, toLandingLang } from '../data/seoLandingPages';
import { getFleetCarouselScale, getVehicleStudioBackground } from '../data/fleetPresentation';
import { translateFleetText } from '../i18n/fleetContent';
import { generateVehicleWhatsAppUrl } from '../lib/whatsapp';
import { SITE_URL, ORGANIZATION_ID } from '../lib/seo';

// Mesmo formato do catálogo ("119.999 Kz"), independente do motor Intl do browser/Node.
const formatKz = (value: number) => `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Kz`;

export const PageVehicle: React.FC = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const page = findVehiclePage(slug);
  if (!page) return <PageNotFound />;

  const { vehicle } = page;
  const lang = toLandingLang(i18n.resolvedLanguage ?? i18n.language);
  const copy = VEHICLE_COPY[lang];
  const labels = LANDING_LABELS[lang];
  const tr = (text: string) => translateFleetText(text, lang);
  const url = `${SITE_URL}${page.path}`;
  const price = formatKz(vehicle.pricePerDayAOA);
  const transfer = formatKz(vehicle.transferPriceAOA ?? vehicle.pricePerDayAOA);
  const input = { name: vehicle.name, city: 'Luanda', price, transfer, seats: vehicle.specs.passengers };
  const specsShort = [`${vehicle.specs.passengers} ${labels.seats}`, tr(vehicle.specs.transmission), tr(vehicle.specs.fuelType), vehicle.specs.traction ? tr(vehicle.specs.traction) : '']
    .filter(Boolean)
    .join(', ');
  const title = copy.metaTitle(input);
  const description = copy.metaDescription({ ...input, specs: specsShort });
  const faq = copy.faq(input);
  const category = tr(vehicle.categoryLabel);

  const specs = [
    [copy.seats, String(vehicle.specs.passengers)],
    [copy.doors, String(vehicle.specs.doors)],
    [copy.luggage, String(vehicle.specs.luggage)],
    [copy.transmission, tr(vehicle.specs.transmission)],
    [copy.fuel, tr(vehicle.specs.fuelType)],
    [copy.traction, vehicle.specs.traction ? tr(vehicle.specs.traction) : ''],
    [copy.engine, vehicle.specs.engine ? tr(vehicle.specs.engine) : ''],
  ].filter(([, value]) => value);

  const similar = VEHICLE_PAGES
    .filter((other) => other.vehicle.category === vehicle.category && other.slug !== page.slug)
    .sort((a, b) => Math.abs(a.vehicle.pricePerDayAOA - vehicle.pricePerDayAOA) - Math.abs(b.vehicle.pricePerDayAOA - vehicle.pricePerDayAOA))
    .slice(0, 4);

  const image = `${SITE_URL}${vehicle.primaryImage}`;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: copy.h1(input),
    description: tr(vehicle.description),
    image,
    url,
    category,
    brand: vehicle.brand ? { '@type': 'Brand', name: vehicle.brand } : undefined,
    additionalType: 'https://schema.org/Car',
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'AOA',
      price: Math.round(vehicle.pricePerDayAOA),
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: Math.round(vehicle.pricePerDayAOA),
        priceCurrency: 'AOA',
        unitCode: 'DAY',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'DAY' },
      },
      availability: 'https://schema.org/InStock',
      areaServed: { '@type': 'Country', name: 'Angola' },
      seller: { '@id': ORGANIZATION_ID },
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  const lists = [
    { title: copy.featuresTitle, items: vehicle.features },
    { title: copy.inclusionsTitle, items: vehicle.inclusions },
    { title: copy.recommendedTitle, items: vehicle.recommendedFor },
  ].filter((list) => list.items.length > 0);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <PageHero
        icon={Car}
        eyebrow={`${copy.eyebrow} · ${category}`}
        title={copy.h1(input)}
        description={tr(vehicle.description)}
        breadcrumb={[{ label: copy.fleet, to: '/frota' }, { label: vehicle.name }]}
      />

      <section className="container-pepek py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div className="flex h-72 items-center justify-center rounded-3xl bg-cover bg-center p-6 sm:h-96" style={{ backgroundImage: `url('${getVehicleStudioBackground(vehicle)}')` }}>
            <img
              src={vehicle.primaryImage}
              alt={`${vehicle.name} — ${copy.h1(input)}`}
              fetchPriority="high"
              decoding="async"
              style={{ '--fleet-image-scale': getFleetCarouselScale(vehicle.id) } as React.CSSProperties}
              className="fleet-vehicle-image is-carousel h-full w-full object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#001E4A]">{copy.pricesTitle}</h2>
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{copy.perDay}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-[#001E4A]">{price}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{copy.transferLabel}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-[#001E4A]">{transfer}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-6 text-slate-500">{copy.transferNote}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/reservar" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FEC228] px-6 text-sm font-extrabold uppercase text-[#09172C] hover:bg-[#FFD45F]">
                {labels.book} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={generateVehicleWhatsAppUrl(vehicle.name, vehicle.pricePerDayAOA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#001E4A]/15 bg-white px-6 text-sm font-extrabold text-[#001E4A] hover:border-[#25D366]">
                <MessageCircle className="h-4 w-4 text-[#25D366]" /> {labels.whatsapp}
              </a>
            </div>

            <h2 className="mt-10 text-2xl font-extrabold text-[#001E4A]">{copy.specsTitle}</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-bold text-[#001E4A]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {lists.map((list) => (
            <article key={list.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#001E4A]">{list.title}</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                {list.items.map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#E4AD28]" />{tr(item)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F4F6FA] py-14 sm:py-16">
        <div className="container-pepek grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-[#001E4A] sm:text-3xl">{labels.faqTitle}</h2>
            <div className="mt-6 space-y-3">
              {faq.map(({ q, a }) => (
                <details key={q} className="rounded-2xl border border-slate-200 bg-white p-5 open:border-[#236199]">
                  <summary className="cursor-pointer font-extrabold text-[#001E4A]">{q}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{a}</p>
                </details>
              ))}
            </div>
          </div>
          {similar.length > 0 && (
            <aside>
              <h2 className="text-xl font-extrabold text-[#001E4A]">{copy.similarTitle}</h2>
              <ul className="mt-6 space-y-3">
                {similar.map((other) => (
                  <li key={other.slug}>
                    <Link to={other.path} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#174B86] hover:border-[#FEC228]">
                      <span>{other.vehicle.name}</span>
                      <span className="whitespace-nowrap text-slate-500">{labels.from} {formatKz(other.vehicle.pricePerDayAOA)}{labels.perDay}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/frota" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#174B86] hover:text-[#001E4A]">
                {labels.viewFleet} <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          )}
        </div>
      </section>

      <BrandCTA />
    </>
  );
};
