import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, CheckCircle2, Download, Eye, EyeOff, FileImage, FileVideo, Loader2, LogIn, Mail,
  Newspaper, Pencil, Plus, Trash2, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  canManageBlog, createPost, deletePost, downloadSubscribersCsv, fetchManagedPosts, fetchSubscribers,
  muxPosterUrl, prepareImage, updatePost, uploadVideo,
  type BlogCategory, type BlogMediaInput, type BlogPost, type NewsletterSubscriber,
} from '../lib/blog';

// Painel interno (só em português): a equipa publica notícias no blogue sem mexer no código.
// O acesso é decidido no servidor (api/_blog.js); aqui só se adapta o ecrã.

const CATEGORIES: BlogCategory[] = ['partnerships', 'protocol', 'experience'];
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;

type MediaChoice = 'keep' | 'none' | 'image' | 'video';
type FormState = {
  id: string | null;
  title: string;
  summary: string;
  category: BlogCategory;
  audience: string;
  mediaChoice: MediaChoice;
  file: File | null;
};

const emptyForm: FormState = { id: null, title: '', summary: '', category: 'experience', audience: '', mediaChoice: 'image', file: null };

const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  : '—';

export const PageBlogAdmin: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isAuthReady, setIsPortalOpen } = useAuth();
  const [tab, setTab] = useState<'posts' | 'newsletter'>('posts');
  const isDemo = currentUser?.id.startsWith('demo_') ?? false;
  const allowed = canManageBlog(currentUser?.role) && !isDemo;

  return (
    <>
      <Helmet>
        <title>Gerir blogue | PEPEK GRUPO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen bg-[#F5F6F6] pb-20 pt-36 text-[#09172C] lg:pt-48">
        <div className="container-pepek">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[.15em] text-[#236199]">Painel interno</span>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Blogue e newsletter</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Publique notícias com foto ou vídeo e consulte quem subscreveu a newsletter.</p>
            </div>
            <Link to="/blogue" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-extrabold text-[#174B86] hover:border-[#236199]">
              <Eye className="h-4 w-4" /> Ver o blogue
            </Link>
          </div>

          {!isAuthReady ? (
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-600"><Loader2 className="h-5 w-5 animate-spin" /> A verificar a sessão…</div>
          ) : !currentUser ? (
            <Notice
              icon={<LogIn className="h-6 w-6" />}
              title="Entre com a sua conta"
              text="Esta área é reservada à equipa PEPEK. Entre na Área de Cliente com a sua conta de trabalho."
              action={<button type="button" onClick={() => setIsPortalOpen(true)} className="rounded-xl bg-[#001E4A] px-5 py-3 text-sm font-extrabold text-white">Entrar</button>}
            />
          ) : isDemo ? (
            <Notice icon={<AlertTriangle className="h-6 w-6" />} title="Modo de demonstração" text="As contas de demonstração não publicam no blogue real. Entre com uma conta real da equipa." />
          ) : !allowed ? (
            <Notice
              icon={<AlertTriangle className="h-6 w-6" />}
              title="Sem permissão"
              text={`A sua conta (${t(`portal.roles.${currentUser.role}`, { defaultValue: currentUser.roleLabel })}) não pode gerir o blogue. Peça à Direcção para atribuir o perfil "Comunicação & Marketing".`}
            />
          ) : (
            <>
              <div className="mt-8 flex gap-2 border-b border-slate-200">
                <TabButton active={tab === 'posts'} onClick={() => setTab('posts')} icon={<Newspaper className="h-4 w-4" />} label="Notícias" />
                <TabButton active={tab === 'newsletter'} onClick={() => setTab('newsletter')} icon={<Mail className="h-4 w-4" />} label="Subscritores" />
              </div>
              {tab === 'posts' ? <PostsManager /> : <SubscribersPanel />}
            </>
          )}
        </div>
      </main>
    </>
  );
};

const Notice: React.FC<{ icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }> = ({ icon, title, text, action }) => (
  <div className="mt-10 flex max-w-2xl flex-col items-start gap-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001E4A] text-[#FEC228]">{icon}</span>
    <h2 className="text-xl font-extrabold">{title}</h2>
    <p className="text-sm leading-6 text-slate-600">{text}</p>
    {action}
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`-mb-px flex items-center gap-2 border-b-2 px-4 pb-3 text-sm font-extrabold ${active ? 'border-[#236199] text-[#236199]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
  >
    {icon} {label}
  </button>
);

// ── Notícias ─────────────────────────────────────────────────────────────────

const PostsManager: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const load = useCallback(async () => {
    try {
      setPosts(await fetchManagedPosts());
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar as notícias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Enquanto houver vídeos em processamento no Mux, a lista actualiza-se sozinha.
  const hasPendingVideo = posts.some((post) => post.videoPending);
  useEffect(() => {
    if (!hasPendingVideo) return;
    const timer = window.setInterval(() => void load(), 15000);
    return () => window.clearInterval(timer);
  }, [hasPendingVideo, load]);

  const replacePost = (post: BlogPost) => setPosts((current) => {
    const exists = current.some((item) => item.id === post.id);
    return exists ? current.map((item) => (item.id === post.id ? post : item)) : [post, ...current];
  });

  const togglePublished = async (post: BlogPost) => {
    try {
      replacePost(await updatePost(post.id, { status: post.status === 'published' ? 'draft' : 'published' }));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Erro ao actualizar.');
    }
  };

  const remove = async (post: BlogPost) => {
    if (!window.confirm(`Apagar a notícia "${post.title}"? Esta acção não pode ser desfeita.`)) return;
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Erro ao apagar.');
    }
  };

  return (
    <section className="mt-6">
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{error}</p>}

      {form ? (
        <PostForm
          initial={form}
          editingPost={posts.find((post) => post.id === form.id) ?? null}
          onCancel={() => setForm(null)}
          onSaved={(post) => { replacePost(post); setForm(null); }}
        />
      ) : (
        <button type="button" onClick={() => setForm(emptyForm)} className="inline-flex items-center gap-2 rounded-xl bg-[#FEC228] px-5 py-3 text-sm font-extrabold text-[#09172C] hover:bg-[#FFD45F]">
          <Plus className="h-4 w-4" /> Nova notícia
        </button>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-extrabold">Notícias publicadas e rascunhos</h2>
        {loading ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> A carregar…</p>
        ) : posts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">Ainda não há notícias criadas aqui. As histórias em vídeo que já estavam no blogue continuam visíveis.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <PostThumb post={post} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider">
                    <StatusBadge post={post} />
                    <span className="text-[#236199]">{t(`blog.categories.${post.category}`)}</span>
                  </div>
                  <h3 className="mt-1 truncate text-base font-extrabold">{post.title}</h3>
                  <p className="text-xs text-slate-500">
                    {post.status === 'published' ? `Publicada em ${formatDate(post.publishedAt)}` : `Actualizada em ${formatDate(post.updatedAt)}`}
                    {post.createdByName && ` · ${post.createdByName}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.status === 'published' && !post.videoPending && (
                    <Link to={`/blogue#${post.slug}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold text-[#174B86] hover:bg-blue-50"><Eye className="h-4 w-4" /> Ver</Link>
                  )}
                  <button type="button" onClick={() => setForm({ id: post.id, title: post.title, summary: post.summary, category: post.category, audience: post.audience, mediaChoice: 'keep', file: null })} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-100"><Pencil className="h-4 w-4" /> Editar</button>
                  <button type="button" onClick={() => void togglePublished(post)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-100">
                    {post.status === 'published' ? <><EyeOff className="h-4 w-4" /> Despublicar</> : <><CheckCircle2 className="h-4 w-4" /> Publicar</>}
                  </button>
                  <button type="button" onClick={() => void remove(post)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Apagar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

const PostThumb: React.FC<{ post: BlogPost }> = ({ post }) => {
  const src = post.mediaType === 'image' ? post.imageUrl : post.muxPlaybackId ? muxPosterUrl(post.muxPlaybackId) : null;
  return (
    <div className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#001E4A] sm:w-32">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : post.mediaType === 'video'
        ? <FileVideo className="h-7 w-7 text-[#FEC228]" />
        : <Newspaper className="h-7 w-7 text-[#FEC228]" />}
    </div>
  );
};

const StatusBadge: React.FC<{ post: BlogPost }> = ({ post }) => {
  if (post.videoPending) return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800"><Loader2 className="h-3 w-3 animate-spin" /> Vídeo em processamento</span>;
  return post.status === 'published'
    ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Publicada</span>
    : <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">Rascunho</span>;
};

// ── Formulário ───────────────────────────────────────────────────────────────

const PostForm: React.FC<{
  initial: FormState;
  editingPost: BlogPost | null;
  onCancel: () => void;
  onSaved: (post: BlogPost) => void;
}> = ({ initial, editingPost, onCancel, onSaved }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initial);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(form.id);

  useEffect(() => {
    if (!form.file) { setPreview(null); return; }
    const url = URL.createObjectURL(form.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.file]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const chooseMedia = (choice: MediaChoice) => {
    setForm((current) => ({ ...current, mediaChoice: choice, file: null }));
    if (fileInput.current) fileInput.current.value = '';
  };

  const onFile = (file: File | null) => {
    setError(null);
    if (!file) return set('file', null);
    if (form.mediaChoice === 'video') {
      if (!file.type.startsWith('video/')) return setError('Escolha um ficheiro de vídeo (MP4, MOV…).');
      if (file.size > MAX_VIDEO_BYTES) return setError('O vídeo tem mais de 2 GB. Reduza-o antes de enviar.');
    } else if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      return setError('Escolha uma fotografia em JPG, PNG ou WebP.');
    }
    set('file', file);
  };

  const submit = async (status: 'draft' | 'published') => {
    setError(null);
    if (form.title.trim().length < 3) return setError('Escreva um título.');
    if (form.summary.trim().length < 3) return setError('Escreva o texto da notícia.');
    if ((form.mediaChoice === 'image' || form.mediaChoice === 'video') && !form.file) {
      return setError(form.mediaChoice === 'video' ? 'Escolha o vídeo a enviar.' : 'Escolha a fotografia a enviar.');
    }

    try {
      let media: BlogMediaInput | undefined;
      if (form.mediaChoice === 'none') media = { type: 'none' };
      if (form.mediaChoice === 'image' && form.file) {
        setBusy('A preparar a fotografia…');
        media = { type: 'image', dataUrl: await prepareImage(form.file) };
      }
      if (form.mediaChoice === 'video' && form.file) {
        setBusy('A enviar o vídeo… 0%');
        const uploadId = await uploadVideo(form.file, (percent) => setBusy(`A enviar o vídeo… ${percent}%`));
        media = { type: 'video', uploadId };
      }

      setBusy('A guardar…');
      const fields = { title: form.title.trim(), summary: form.summary.trim(), category: form.category, audience: form.audience.trim(), status };
      const post = form.id
        ? await updatePost(form.id, media ? { ...fields, media } : fields)
        : await createPost({ ...fields, media: media ?? { type: 'none' } });
      onSaved(post);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Não foi possível guardar.');
    } finally {
      setBusy(null);
    }
  };

  const mediaOptions: { value: MediaChoice; label: string; icon: React.ReactNode }[] = [
    ...(isEditing && editingPost ? [{ value: 'keep' as const, label: 'Manter a actual', icon: <CheckCircle2 className="h-4 w-4" /> }] : []),
    { value: 'image', label: 'Fotografia', icon: <FileImage className="h-4 w-4" /> },
    { value: 'video', label: 'Vídeo', icon: <FileVideo className="h-4 w-4" /> },
    { value: 'none', label: 'Só texto', icon: <Newspaper className="h-4 w-4" /> },
  ];

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#236199] focus:ring-2 focus:ring-[#236199]/20';

  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit('published'); }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-extrabold">{isEditing ? 'Editar notícia' : 'Nova notícia'}</h2>
        <button type="button" onClick={onCancel} disabled={Boolean(busy)} aria-label="Fechar" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="block text-sm font-bold lg:col-span-2">
          Título
          <input value={form.title} onChange={(event) => set('title', event.target.value)} maxLength={160} required placeholder="Ex.: PEPEK apoia a cimeira X em Luanda" className={inputClass} />
        </label>
        <label className="block text-sm font-bold lg:col-span-2">
          Texto
          <textarea value={form.summary} onChange={(event) => set('summary', event.target.value)} maxLength={1200} required rows={5} placeholder="O que aconteceu, onde, quando e com quem." className={inputClass} />
          <span className="mt-1 block text-right text-xs font-normal text-slate-500">{form.summary.length}/1200</span>
        </label>
        <label className="block text-sm font-bold">
          Categoria
          <select value={form.category} onChange={(event) => set('category', event.target.value as BlogCategory)} className={inputClass}>
            {CATEGORIES.map((category) => <option key={category} value={category}>{t(`blog.categories.${category}`)}</option>)}
          </select>
        </label>
        <label className="block text-sm font-bold">
          Para quem é <span className="font-normal text-slate-500">(opcional)</span>
          <input value={form.audience} onChange={(event) => set('audience', event.target.value)} maxLength={120} placeholder="Ex.: Empresas, Comitivas e delegações" className={inputClass} />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold">Imagem ou vídeo</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {mediaOptions.map((option) => (
            <button key={option.value} type="button" aria-pressed={form.mediaChoice === option.value} onClick={() => chooseMedia(option.value)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold ${form.mediaChoice === option.value ? 'border-[#FEC228] bg-[#FEC228]/80' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
              {option.icon} {option.label}
            </button>
          ))}
        </div>

        {(form.mediaChoice === 'image' || form.mediaChoice === 'video') && (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <input
              ref={fileInput}
              type="file"
              accept={form.mediaChoice === 'video' ? 'video/*' : 'image/jpeg,image/png,image/webp'}
              onChange={(event) => onFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#001E4A] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
            <p className="mt-2 text-xs text-slate-500">
              {form.mediaChoice === 'video'
                ? 'MP4 ou MOV, até 2 GB. Depois de enviado, o vídeo demora alguns minutos a ficar pronto e a notícia aparece no blogue assim que estiver.'
                : 'JPG, PNG ou WebP. A fotografia é reduzida automaticamente para carregar depressa.'}
            </p>
            {preview && (form.mediaChoice === 'video'
              ? <video src={preview} controls className="mt-4 max-h-64 rounded-xl bg-black" />
              : <img src={preview} alt="Pré-visualização" className="mt-4 max-h-64 rounded-xl object-contain" />)}
          </div>
        )}
      </fieldset>

      {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{error}</p>}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
        {busy && <span className="flex items-center gap-2 text-sm font-bold text-[#236199] sm:mr-auto"><Loader2 className="h-4 w-4 animate-spin" /> {busy}</span>}
        <button type="button" disabled={Boolean(busy)} onClick={() => void submit('draft')} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 hover:border-slate-400 disabled:opacity-50">Guardar rascunho</button>
        <button type="submit" disabled={Boolean(busy)} className="rounded-xl bg-[#001E4A] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0C2E60] disabled:opacity-50">Publicar no blogue</button>
      </div>
    </form>
  );
};

// ── Newsletter ───────────────────────────────────────────────────────────────

const SubscribersPanel: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSubscribers().then(setSubscribers).catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar.');
    });
  }, []);

  const exportCsv = async () => {
    setExporting(true);
    try {
      await downloadSubscribersCsv();
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Erro ao exportar.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold">Subscritores da newsletter</h2>
          <p className="text-sm text-slate-600">{subscribers ? `${subscribers.length} ${subscribers.length === 1 ? 'pessoa subscreveu' : 'pessoas subscreveram'} no blogue.` : 'A carregar…'}</p>
        </div>
        <button type="button" onClick={() => void exportCsv()} disabled={exporting || !subscribers?.length} className="inline-flex items-center gap-2 rounded-xl bg-[#001E4A] px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Exportar (Excel/CSV)
        </button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{error}</p>}
      {subscribers && subscribers.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="py-2 pr-4">E-mail</th><th className="py-2 pr-4">Idioma</th><th className="py-2">Data</th></tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.email} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 font-semibold">{subscriber.email}</td>
                  <td className="py-2.5 pr-4 uppercase text-slate-600">{subscriber.language}</td>
                  <td className="py-2.5 text-slate-600">{formatDate(subscriber.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
