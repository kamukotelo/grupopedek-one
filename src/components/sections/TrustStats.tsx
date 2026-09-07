import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, BriefcaseBusiness, Car, Clock3 } from 'lucide-react';

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

const stats = [
  [10, '', 'about.statExperience', Award],
  [500, '', 'about.statClients', BriefcaseBusiness],
  [25, '', 'about.statBrands', Car],
  [24, '/7', 'about.statSupport', Clock3],
] as const;

/** Faixa de indicadores institucionais — usada na home e em "Quem Somos". */
export const TrustStats: React.FC = () => {
  const { t } = useTranslation();

  return (
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
  );
};
