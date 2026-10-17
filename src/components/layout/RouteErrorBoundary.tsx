import React from 'react';
import i18n from '../../i18n';
import { isStaleChunkError, recoverFromStaleBuild } from '../../lib/staleBuild';

type Props = { children: React.ReactNode; resetKey: string };
type State = { error: Error | null };

/**
 * Se uma página falhar, mostra uma mensagem com "Recarregar" em vez de deixar o
 * site inteiro em branco. Volta ao normal ao mudar de página (resetKey).
 */
export class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (isStaleChunkError(error)) recoverFromStaleBuild();
    else console.error('Erro na página', error);
  }

  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#F5F6F6] px-4 pb-16 pt-36" role="alert">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#09172C]">{i18n.t('system.pageErrorTitle')}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{i18n.t('system.pageErrorText')}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={() => window.location.reload()} className="min-h-12 rounded-xl bg-[#001E4A] px-5 text-sm font-extrabold text-white hover:bg-[#174B86]">
              {i18n.t('system.pageErrorReload')}
            </button>
            <a href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-extrabold text-[#174B86] hover:border-[#236199]">
              {i18n.t('system.pageErrorHome')}
            </a>
          </div>
        </div>
      </section>
    );
  }
}
