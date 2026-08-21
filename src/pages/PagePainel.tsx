import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { ClientPortalModal } from '../components/portal/ClientPortalModal';

// Painel de Gestão — apenas para utilizadores autenticados
// Esta página não aparece no menu de navegação público
export const PagePainel: React.FC = () => {
  const { currentUser, setIsPortalOpen } = useAuth();

  useEffect(() => {
    // Abrir o portal automaticamente ao navegar para /painel
    setIsPortalOpen(true);
  }, [setIsPortalOpen]);

  return (
    <>
      <Helmet>
        <title>Painel de Gestão – PEPEK GRUPO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[#06142F] flex items-center justify-center pt-28">
        {!currentUser && (
          <div className="text-center text-white space-y-4 p-8">
            <h1 className="text-2xl font-bold">Área Reservada</h1>
            <p className="text-gray-400">Por favor inicie sessão para aceder ao painel de gestão.</p>
            {/* TODO: Implementar formulário de login real (email/password ou OAuth) */}
          </div>
        )}
      </div>
      <ClientPortalModal />
    </>
  );
};
