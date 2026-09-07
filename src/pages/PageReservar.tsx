import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarCheck } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { BookingWidget } from '../components/sections/BookingWidget';
import { PaymentSecurity } from '../components/sections/PaymentSecurity';

export const PageReservar: React.FC = () => (
  <>
    <Helmet>
      <title>Solicitar Reserva Online – PEPEK GRUPO RENT-A-CAR Angola</title>
      <meta name="description" content="Reserve a sua viatura executiva online. Confirmação imediata pela Central de Operações em Talatona, Luanda. Disponível 24/7." />
      <meta property="og:title" content="Solicitar Reserva | PEPEK GRUPO" />
      <meta property="og:description" content="Indique datas, localidades e necessidades da viagem. A Central de Operações confirma a disponibilidade." />
      <meta property="og:url" content="https://pepekgrupo.com/reservar" />
      <link rel="canonical" href="https://pepekgrupo.com/reservar" />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ReserveAction',
        name: 'Solicitar reserva PEPEK GRUPO',
        target: 'https://pepekgrupo.com/reservar',
      })}</script>
    </Helmet>

    <PageHero
      icon={CalendarCheck}
      eyebrow="Sistema oficial de reserva"
      title="Planeie a sua deslocação em poucos passos."
      description="Escolha o serviço, indique datas e localidades e receba a confirmação da Central de Operações. Sem compromisso até validarmos a disponibilidade."
      breadcrumb={[{ label: 'Reservar' }]}
    />

    <BookingWidget initialVehicle="Novo Toyota Prado" />
    <PaymentSecurity />
  </>
);
