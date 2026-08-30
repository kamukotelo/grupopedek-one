import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, LockKeyhole, Clock3, UserRoundCheck } from 'lucide-react';

const principles = [
  ['Dados necessários', 'Pedimos apenas dados de contacto e da reserva necessários para responder, confirmar e prestar o serviço. Não solicite documentos por WhatsApp ou pelas observações do pedido.', UserRoundCheck],
  ['Acesso protegido', 'As reservas, faturas e informação operacional são disponibilizadas apenas a utilizadores autenticados e perfis autorizados.', LockKeyhole],
  ['Retenção responsável', 'Os dados são mantidos apenas durante o tempo necessário para a operação, faturação, obrigações legais e resolução de pedidos.', Clock3],
];

export const PagePrivacidade: React.FC = () => (
  <>
    <Helmet>
      <title>Privacidade e Proteção de Dados | PEPEK GRUPO</title>
      <meta name="description" content="Como a PEPEK GRUPO trata dados pessoais em pedidos de mobilidade e rent-a-car." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://pepekgrupo.com/privacidade" />
    </Helmet>
    <section className="bg-[#F5F6F6] py-28 sm:py-32">
      <div className="container-pepek max-w-5xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#236199]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#09172C]"><ShieldCheck className="h-4 w-4 text-[#E4AD28]" /> Confiança e privacidade</span>
        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-[#09172C] sm:text-5xl">Proteção de dados em cada pedido.</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">A PEPEK GRUPO trata os seus dados para responder a pedidos, organizar a mobilidade, emitir documentos de faturação e prestar apoio. Nunca envie NIF, passaporte, carta de condução, cartão ou PIN por WhatsApp.</p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map(([title, text, Icon]) => {
            const PrincipleIcon = Icon as typeof ShieldCheck;
            return <article key={title as string} className="rounded-2xl border border-[#236199]/15 bg-white p-6 shadow-sm"><PrincipleIcon className="h-7 w-7 text-[#E4AD28]" /><h2 className="mt-5 text-lg font-extrabold text-[#09172C]">{title as string}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">{text as string}</p></article>;
          })}
        </div>

        <div className="mt-10 rounded-2xl bg-[#001E4A] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-extrabold">Canais seguros</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">Após a confirmação, a equipa indicará o canal autorizado quando for necessário validar documentação contratual ou de condução. Pode pedir esclarecimentos, atualização ou eliminação de dados através de <a className="font-bold text-[#FEC228] hover:underline" href="mailto:geral@pepekgrupo.com">geral@pepekgrupo.com</a>.</p>
          <p className="mt-5 text-xs leading-relaxed text-white/55">Esta página descreve o funcionamento digital atual. A política jurídica final deve ser revista e aprovada pela direção e assessoria legal antes do início de operação comercial.</p>
        </div>
        <Link to="/contactos" className="mt-8 inline-flex rounded-xl bg-[#FEC228] px-5 py-3 text-sm font-extrabold text-[#09172C] transition hover:bg-[#FFD45F]">Falar com a equipa</Link>
      </div>
    </section>
  </>
);
