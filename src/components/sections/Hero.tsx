import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Award, CalendarDays, Clock3, MapPin, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');

  const handleAvailability = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams({ pickup, destination, startDate, startTime, endDate, endTime });
    navigate(`/reservar?${params.toString()}`);
  };

  const trustItems = [
    { icon: ShieldCheck, title: t('hero.trustPremium'), subtitle: t('hero.trustPremiumSub') },
    { icon: Clock3, title: t('hero.trustFast'), subtitle: t('hero.trustFastSub') },
    { icon: Award, title: t('hero.trustService'), subtitle: t('hero.trustServiceSub') },
  ];

  return (
    <section id="inicio" className="relative min-h-[760px] overflow-hidden bg-[#020A2A] pt-[100px] text-white lg:min-h-[calc(100vh-20px)] lg:pt-[164px]">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(210,168,32,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(210,168,32,.12)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-full border-t border-[#D2A820]/15 bg-[#06142F] [clip-path:polygon(0_42%,18%_30%,33%_54%,49%_20%,66%_46%,82%_24%,100%_42%,100%_100%,0_100%)]" />

      <div className="container-pepek relative z-10 grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center lg:gap-12 lg:py-14 xl:grid-cols-[minmax(0,1fr)_470px]">
        <div className="relative min-h-[520px] lg:min-h-[580px]">
          <div className="relative z-20 max-w-3xl pt-4 lg:pt-10">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#D2A820]">{t('hero.tag')}</p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl xl:text-[68px]">
              {t('hero.quickHeadline')}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{t('hero.description')}</p>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {trustItems.map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-center gap-3 border-l-2 border-[#D2A820] py-1 pl-3">
                  <Icon className="h-6 w-6 shrink-0 text-[#D2A820]" />
                  <div>
                    <strong className="block text-sm text-white">{title}</strong>
                    <span className="text-[11px] text-slate-400">{subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <img
            src="/rent_car_transparent/NEW-TOYOTA-1-300x300.webp"
            alt="Viatura executiva PEPEK Grupo"
            className="pointer-events-none absolute -bottom-8 right-0 z-10 hidden w-[48%] max-w-[440px] object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,.55)] xl:block"
          />
        </div>

        <form onSubmit={handleAvailability} className="relative z-30 rounded-2xl bg-white p-5 text-[#07133F] shadow-[0_28px_70px_rgba(0,0,0,.35)] sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5">
            <CalendarDays className="h-6 w-6 text-[#C79B17]" />
            <h2 className="text-2xl font-black text-[#07133F]">{t('hero.quickTitle')}</h2>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold">
              <span className="mb-1.5 block">{t('hero.quickPickup')}</span>
              <span className="relative block">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input required value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder={t('hero.quickPickupPlaceholder')} className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#D2A820] focus:ring-2 focus:ring-[#D2A820]/20" />
              </span>
            </label>

            <label className="block text-sm font-bold">
              <span className="mb-1.5 block">{t('hero.quickReturn')}</span>
              <span className="relative block">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={t('hero.quickReturnPlaceholder')} className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#D2A820] focus:ring-2 focus:ring-[#D2A820]/20" />
              </span>
            </label>

            <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-3">
              <label className="block text-sm font-bold"><span className="mb-1.5 block">{t('hero.quickPickupDate')}</span><input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-[#D2A820] focus:outline-none" /></label>
              <label className="block text-sm font-bold"><span className="mb-1.5 block">{t('hero.quickTime')}</span><input required type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-12 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-[#D2A820] focus:outline-none" /></label>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-3">
              <label className="block text-sm font-bold"><span className="mb-1.5 block">{t('hero.quickReturnDate')}</span><input required min={startDate} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-[#D2A820] focus:outline-none" /></label>
              <label className="block text-sm font-bold"><span className="mb-1.5 block">{t('hero.quickTime')}</span><input required type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-12 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-[#D2A820] focus:outline-none" /></label>
            </div>
          </div>

          <button type="submit" className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#D2A820] px-5 text-sm font-black uppercase tracking-[0.08em] text-[#020A2A] transition hover:bg-[#E2C06E] focus-visible:outline-[#07133F]">
            {t('hero.quickSubmit')}
          </button>
        </form>
      </div>
    </section>
  );
};
