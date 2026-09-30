import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Check, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { submitReservation } from '../../lib/reservations';
import { generateWhatsAppBookingUrl } from '../../lib/whatsapp';
import type { BookingData } from '../../types';
import type { VehicleCategory, VehicleDetail } from '../../data/fleetData';
import { PUBLIC_FLEET } from '../../data/fleetFlyer2026';
import { getFleetCarouselScale, getVehicleStudioBackground } from '../../data/fleetPresentation';

/** Extras cobrados à parte (Kz). O motorista é por dia; a higienização é por aluguer. */
export const DRIVER_PRICE_PER_DAY = 35000;
export const CLEANING_PRICE = 35000;

const CATEGORY_ORDER: { id: VehicleCategory; labelKey: string }[] = [
  { id: 'economicos', labelKey: 'fleet.economy' },
  { id: 'suvs', labelKey: 'fleet.suvs' },
  { id: 'pickups', labelKey: 'fleet.pickupsTrucks' },
  { id: 'vans', labelKey: 'fleet.vansTransport' },
  { id: 'luxo', labelKey: 'fleet.luxury' },
  { id: 'eventos', labelKey: 'fleet.specialEvents' },
];

// Mesmo formato do catálogo ("119.999 Kz"), independente do motor Intl.
const formatKz = (value: number) => `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Kz`;

/** Aceita ?viatura=<id> (botões do site) ou o nome da viatura (formulário da página inicial). */
const findVehicle = (query: string | null): VehicleDetail | undefined => {
  if (!query) return undefined;
  const q = query.toLowerCase();
  return PUBLIC_FLEET.find((v) => v.id === q)
    ?? PUBLIC_FLEET.find((v) => v.name.toLowerCase() === q)
    ?? PUBLIC_FLEET.find((v) => v.name.toLowerCase().includes(q) || q.includes(v.name.toLowerCase()));
};

const countDays = (start: string, end: string) => {
  if (!start || !end) return 1;
  const diff = Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
  return Number.isFinite(diff) && diff > 0 ? diff : 1;
};

const inputClass = 'w-full rounded-xl border border-[#D5DCE6] bg-white px-4 py-3 text-base text-[#09172C] outline-none focus:border-[#236199] focus:ring-2 focus:ring-[#FEC228]/60';
const labelClass = 'mb-1.5 block min-h-0! text-sm font-bold text-[#09172C]';
const stepClass = 'text-xs font-extrabold uppercase tracking-wider text-[#236199]';

export const BookingWidget: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialVehicle = findVehicle(searchParams.get('viatura'));

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [category, setCategory] = useState<VehicleCategory | null>(
    initialVehicle?.category ?? (searchParams.get('categoria') as VehicleCategory | null),
  );
  const [vehicle, setVehicle] = useState<VehicleDetail | undefined>(initialVehicle);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') ?? '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') ?? '');
  const [withDriver, setWithDriver] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [notes, setNotes] = useState(() => {
    const pickup = searchParams.get('pickup');
    const destination = searchParams.get('destination');
    return [pickup, destination].filter(Boolean).join(' → ');
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [protocolCode, setProtocolCode] = useState<string | null>(null);

  const vehiclesInCategory = useMemo(
    () => (category ? PUBLIC_FLEET.filter((v) => v.category === category).sort((a, b) => a.pricePerDayAOA - b.pricePerDayAOA) : []),
    [category],
  );

  // A viatura vinda de um botão "Reservar" fica visível na lista, sem mexer no resto da página.
  const vehicleListRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = vehicleListRef.current;
    const selected = list?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (list && selected) list.scrollTop = (selected.closest('li')?.offsetTop ?? 0) - 8;
    // Só ao abrir o formulário.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = countDays(startDate, endDate);
  const vehicleTotal = vehicle ? vehicle.pricePerDayAOA * days : 0;
  const driverTotal = withDriver ? DRIVER_PRICE_PER_DAY * days : 0;
  const cleaningTotal = cleaning ? CLEANING_PRICE : 0;
  const total = vehicleTotal + driverTotal + cleaningTotal;
  const today = new Date().toISOString().slice(0, 10);

  const extrasText = [
    withDriver ? `${t('bookingForm.driver')} (${formatKz(driverTotal)})` : '',
    cleaning ? `${t('bookingForm.cleaning')} (${formatKz(cleaningTotal)})` : '',
  ].filter(Boolean).join(', ');

  const booking: BookingData = {
    service: 'rent-a-car',
    location: 'Luanda',
    startDate,
    endDate,
    vehicleCategory: vehicle ? `${vehicle.name} — ${formatKz(vehicle.pricePerDayAOA)}/dia` : undefined,
    withDriver,
    clientName,
    clientPhone,
    clientEmail,
    notes: [
      extrasText && `${t('whatsapp.extras')}: ${extrasText}`,
      vehicle && `${t('whatsapp.estimate')}: ${formatKz(total)} (${t('bookingForm.days', { count: days })})`,
      notes,
    ].filter(Boolean).join(' | '),
    estimatedPrice: vehicle ? `${formatKz(total)} (${days} ${days === 1 ? 'dia' : 'dias'})` : undefined,
    cleaning,
    message: notes,
    currency: 'AOA',
    status: 'pending',
    source: 'web_booking_form',
    createdAt: new Date().toISOString(),
  };
  const whatsappUrl = generateWhatsAppBookingUrl({ ...booking, protocolCode: protocolCode ?? undefined });

  const chooseCategory = (id: VehicleCategory) => {
    setCategory(id);
    if (vehicle?.category !== id) setVehicle(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!vehicle) {
      setError(t('bookingForm.missingVehicle'));
      document.getElementById('booking-vehicle')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const receipt = await submitReservation(booking);
      setProtocolCode(receipt.protocolCode);
      document.getElementById('reserva')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('booking.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (protocolCode) {
    return (
      <section id="reserva" className="scroll-mt-24 bg-[#F5F6F6] px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-lg sm:p-10">
          <CheckCircle2 className="mx-auto h-14 w-14 text-[#25A55F]" />
          <h2 className="mt-4 text-2xl font-extrabold text-[#09172C]">{t('bookingForm.successTitle')}</h2>
          <p className="mt-3 text-base leading-7 text-[#555B64]">{t('bookingForm.successText', { code: protocolCode })}</p>
          {vehicle && (
            <p className="mt-4 rounded-xl bg-[#F5F6F6] p-4 text-sm text-[#09172C]">
              <strong>{vehicle.name}</strong> · {t('bookingForm.days', { count: days })}
              {extrasText && <> · {extrasText}</>}
              <br />
              {t('bookingForm.total')}: <strong>{formatKz(total)}</strong>
            </p>
          )}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-base font-extrabold text-white hover:bg-[#1DA851]">
            <MessageCircle className="h-5 w-5" /> {t('bookingForm.successWhatsapp')}
          </a>
          <button type="button" onClick={() => setProtocolCode(null)} className="mt-4 text-sm font-bold text-[#236199] hover:underline">
            {t('bookingForm.newRequest')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="reserva" className="scroll-mt-24 bg-[#F5F6F6] px-4 py-8 sm:py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-lg sm:p-8">
        {/* 1. Dados do cliente */}
        <fieldset className="space-y-4">
          <legend className={stepClass}>1 · {t('bookingForm.contactStep')}</legend>
          <div>
            <label htmlFor="bf-name" className={labelClass}>{t('bookingForm.name')}</label>
            <input id="bf-name" type="text" autoComplete="name" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('bookingForm.namePh')} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bf-phone" className={labelClass}>{t('bookingForm.phone')}</label>
              <input id="bf-phone" type="tel" inputMode="tel" autoComplete="tel" required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+244 9XX XXX XXX" className={inputClass} />
            </div>
            <div>
              <label htmlFor="bf-email" className={labelClass}>{t('bookingForm.email')} <span className="font-normal text-[#555B64]">({t('bookingForm.optional')})</span></label>
              <input id="bf-email" type="email" autoComplete="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="nome@email.com" className={inputClass} />
            </div>
          </div>
        </fieldset>

        {/* 2. Tipo de viatura */}
        <fieldset>
          <legend className={stepClass}>2 · {t('bookingForm.typeStep')}</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORY_ORDER.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => chooseCategory(id)}
                aria-pressed={category === id}
                className={`min-h-12 rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${category === id ? 'border-[#FEC228] bg-[#09172C] text-[#FEC228]' : 'border-[#D5DCE6] bg-white text-[#09172C] hover:border-[#236199]'}`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 3. Viatura (lista com preço) */}
        <fieldset id="booking-vehicle" className="scroll-mt-28">
          <legend className={stepClass}>3 · {t('bookingForm.vehicleStep')}</legend>
          {!category ? (
            <p className="mt-3 rounded-xl bg-[#F5F6F6] p-4 text-sm text-[#555B64]">{t('bookingForm.chooseTypeHint')}</p>
          ) : (
            <ul ref={vehicleListRef} className="relative mt-3 grid max-h-[26rem] gap-2 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2">
              {vehiclesInCategory.map((v) => {
                const selected = vehicle?.id === v.id;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => { setVehicle(v); setError(''); }}
                      aria-pressed={selected}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 p-2 text-left transition ${selected ? 'border-[#FEC228] bg-[#FEC228]/15' : 'border-[#E2E8F0] bg-white hover:border-[#236199]'}`}
                    >
                      <span className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cover bg-center p-1" style={{ backgroundImage: `url('${getVehicleStudioBackground(v)}')` }}>
                        <img src={v.primaryImage} alt="" loading="lazy" decoding="async" style={{ '--fleet-image-scale': getFleetCarouselScale(v.id) } as React.CSSProperties} className="fleet-vehicle-image is-carousel h-full w-full object-contain" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-extrabold leading-tight text-[#09172C]">{v.name}</span>
                        <span className="mt-0.5 block text-xs text-[#555B64]">{v.specs.passengers} {t('fleet.seats')}</span>
                        <span className="mt-0.5 block text-sm font-extrabold text-[#236199]">{formatKz(v.pricePerDayAOA)}{t('bookingForm.perDay')}</span>
                      </span>
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-[#FEC228] bg-[#FEC228] text-[#09172C]' : 'border-[#D5DCE6]'}`}>
                        {selected && <Check className="h-4 w-4" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </fieldset>

        {/* 4. Datas */}
        <fieldset>
          <legend className={stepClass}>4 · {t('bookingForm.datesStep')}</legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="bf-start" className={labelClass}>{t('bookingForm.startDate')}</label>
              <input id="bf-start" type="date" required min={today} value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate(e.target.value); }} className={inputClass} />
            </div>
            <div>
              <label htmlFor="bf-end" className={labelClass}>{t('bookingForm.endDate')}</label>
              <input id="bf-end" type="date" required min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>
        </fieldset>

        {/* 5. Extras */}
        <fieldset>
          <legend className={stepClass}>5 · {t('bookingForm.extrasStep')}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { checked: withDriver, set: setWithDriver, label: t('bookingForm.driver'), hint: t('bookingForm.driverHint', { price: formatKz(DRIVER_PRICE_PER_DAY) }) },
              { checked: cleaning, set: setCleaning, label: t('bookingForm.cleaning'), hint: t('bookingForm.cleaningHint', { price: formatKz(CLEANING_PRICE) }) },
            ].map((extra) => (
              <label key={extra.label} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition ${extra.checked ? 'border-[#FEC228] bg-[#FEC228]/15' : 'border-[#E2E8F0] bg-white'}`}>
                <input type="checkbox" checked={extra.checked} onChange={(e) => extra.set(e.target.checked)} className="h-5 w-5 accent-[#236199]" />
                <span className="flex-1 text-sm font-bold text-[#09172C]">{extra.label}</span>
                <span className="text-sm font-extrabold text-[#236199]">{extra.hint}</span>
              </label>
            ))}
          </div>
          <label htmlFor="bf-notes" className={`${labelClass} mt-4`}>{t('bookingForm.notes')}</label>
          <textarea id="bf-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('bookingForm.notesPh')} className={inputClass} />
        </fieldset>

        {/* Resumo + envio */}
        {vehicle && (
          <div className="rounded-xl bg-[#09172C] p-4 text-sm text-white sm:p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#FEC228]">{t('bookingForm.summary')}</p>
            <dl className="mt-3 space-y-1.5">
              <div className="flex justify-between gap-3"><dt>{vehicle.name} · {t('bookingForm.days', { count: days })}</dt><dd className="font-bold">{formatKz(vehicleTotal)}</dd></div>
              {withDriver && <div className="flex justify-between gap-3"><dt>{t('bookingForm.driver')}</dt><dd className="font-bold">{formatKz(driverTotal)}</dd></div>}
              {cleaning && <div className="flex justify-between gap-3"><dt>{t('bookingForm.cleaning')}</dt><dd className="font-bold">{formatKz(cleaningTotal)}</dd></div>}
              <div className="flex justify-between gap-3 border-t border-white/15 pt-2 text-base"><dt className="font-bold">{t('bookingForm.total')}</dt><dd className="font-extrabold text-[#FEC228]">{formatKz(total)}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-white/60">{t('bookingForm.estimateNote')}</p>
          </div>
        )}

        {error && <p role="alert" className="rounded-xl border border-[#E4AD28] bg-[#FEC228]/20 p-3 text-sm font-semibold text-[#09172C]">{error}</p>}

        <div className="space-y-3">
          <button type="submit" disabled={isSubmitting} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#FEC228] px-6 text-base font-extrabold text-[#09172C] shadow-md hover:bg-[#FFD45F] disabled:opacity-60">
            <Send className="h-5 w-5" /> {isSubmitting ? t('bookingForm.sending') : t('bookingForm.submit')}
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] px-6 text-sm font-extrabold text-[#09172C] hover:bg-[#25D366]/10">
            <MessageCircle className="h-5 w-5 text-[#25D366]" /> {t('bookingForm.orWhatsapp')}
          </a>
        </div>
      </form>
    </section>
  );
};
