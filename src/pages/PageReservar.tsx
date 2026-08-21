import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookingWidget } from '../components/sections/BookingWidget';

export const PageReservar: React.FC = () => (
  <>
    <Helmet>
      <title>Solicitar Reserva Online – PEPEK GRUPO RENT-A-CAR Angola</title>
      <meta name="description" content="Reserve a sua viatura executiva online. Confirmação imediata pela Central de Operações em Talatona, Luanda. Disponível 24/7." />
      <link rel="canonical" href="https://pepekgrupo.com/reservar" />
    </Helmet>
    <div className="pt-28">
      <BookingWidget initialVehicle="SUV Executiva — Land Cruiser Prado / LC300" />
    </div>
  </>
);
