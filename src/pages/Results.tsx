import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '../lib/auth';
import { generateText, getImageUrl } from '../lib/pollinations';
import { TEXT_PROMPTS, IMAGE_PROMPTS, IMAGE_ENHANCER_PROMPTS } from '../lib/prompts';
import { saveToHistory, type HistoryEntry } from '../lib/history';
import DownloadAll from '../components/DownloadAll';
import Sidebar from '../components/Sidebar';
import type { AnyOutput, TextOutput as TOut, ImageOutput as IOut } from '../lib/types';

const TEXT_TYPES = ['positioning', 'landing', 'instagram', 'twitter', 'linkedin', 'faq'] as const;
const IMAGE_TYPES = ['hero', 'logo', 'social-image', 'og'] as const;
const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  hero: { width: 1200, height: 630 },
  logo: { width: 1024, height: 1024 },
  'social-image': { width: 1080, height: 1080 },
  og: { width: 1200, height: 630 },
};

const BENTO: { id: string; span: string }[] = [
  { id: 'hero', span: 'lg:col-span-2' },
  { id: 'positioning', span: '' },
  { id: 'landing', span: '' },
  { id: 'logo', span: '' },
  { id: 'instagram', span: '' },
  { id: 'social-image', span: 'lg:col-span-2' },
  { id: 'twitter', span: '' },
  { id: 'linkedin', span: '' },
  { id: 'og', span: '' },
  { id: 'faq', span: '' },
];

const META: Record<string, { label: string; badge: 'copy' | 'visual'; icon: string }> = {
  positioning: { label: 'Positioning', badge: 'copy', icon: 'description' },
  landing: { label: 'Landing Page H1', badge: 'copy', icon: 'web' },
  instagram: { label: 'Instagram Caption', badge: 'copy', icon: 'share' },
  twitter: { label: 'Twitter Thread', badge: 'copy', icon: 'tag' },
  linkedin: { label: 'LinkedIn Post', badge: 'copy', icon: 'work' },
  faq: { label: 'Founder FAQ', badge: 'copy', icon: 'help' },
  hero: { label: 'Hero Image', badge: 'visual', icon: 'image' },
  logo: { label: 'Logo Mark', badge: 'visual', icon: 'diamond' },
  'social-image': { label: 'Social Post Grid', badge: 'visual', icon: 'grid_view' },
  og: { label: 'OG Image', badge: 'visual', icon: 'language' },
};

export default function Results() {
  const navigate = useNavigate();
  const [outputs, setOutputs] = useState<AnyOutput[]>([]);
  const [idea, setIdea] = useState('');
  const [textModel, setTextModel] = useState('openai');
  const [imageModel, setImageModel] = useState('flux');
  const [tab, setTab] = useState<'all' | 'copy' | 'visuals'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    const storedIdea = sessionStorage.getItem('product_idea');
    const apiKey = getApiKey();
    const tm = sessionStorage.getItem('text_model') || 'openai';
    const im = sessionStorage.getItem('image_model') || 'flux';
    if (!storedIdea || !apiKey) { navigate('/'); return; }
    setIdea(storedIdea);
    setTextModel(tm);
    setImageModel(im);

    // Load from history
    const he = sessionStorage.getItem('history_entry');
    if (he) {
      try {
        const entry: HistoryEntry = JSON.parse(he);
        setOutputs(entry.outputs.map(o => TEXT_TYPES.includes(o.type as any)
          ? { id: o.id, type: o.type as AnyOutput['type'], content: o.content || '', status: 'done' as const }
          : { id: o.id, type: o.type as AnyOutput['type'], url: o.url || '', ...IMAGE_SIZES[o.id], status: 'done' as const }));
        sessionStorage.removeItem('history_entry');
        return;
      } catch {}
    }

    // Fresh generation
    const initial: AnyOutput[] = [
      ...TEXT_TYPES.map(t => ({ id: t, type: t as AnyOutput['type'], content: '', status: 'pending' as const })),
      ...IMAGE_TYPES.map(t => ({ id: t, type: t as AnyOutput['type'], url: '', ...IMAGE_SIZES[t], status: 'pending' as const })),
    ];
    setOutputs(initial);

    // Generate text outputs in parallel
    TEXT_TYPES.forEach(async (type) => {
      const { system, user } = TEXT_PROMPTS[type](storedIdea);
      setOutputs(p => p.map(o => o.id === type ? { ...o, status: 'loading' } : o));
      try {
        const content = await generateText(system, user, apiKey, tm);
        setOutputs(p => p.map(o => o.id === type ? { ...o, content, status: 'done' } : o));
      } catch (err: any) {
        setOutputs(p => p.map(o => o.id === type ? { ...o, status: 'error', error: err.message } : o));
      }
    });

    // Generate images with enhanced prompts
    IMAGE_TYPES.forEach(async (type) => {
      setOutputs(p => p.map(o => o.id === type ? { ...o, status: 'loading' } : o));
      try {
        const enhancedPrompt = await generateText(IMAGE_ENHANCER_PROMPTS[type], storedIdea, apiKey, tm);
        const url = getImageUrl(enhancedPrompt, IMAGE_SIZES[type].width, IMAGE_SIZES[type].height, im, apiKey);
        setOutputs(p => p.map(o => o.id === type ? { ...o, url, status: 'done' } : o));
      } catch {
        const url = getImageUrl(IMAGE_PROMPTS[type](storedIdea), IMAGE_SIZES[type].width, IMAGE_SIZES[type].height, im, apiKey);
        setOutputs(p => p.map(o => o.id === type ? { ...o, url, status: 'done' } : o));
      }
    });
  }, [navigate]);

  // Save to history
  useEffect(() => {
    if (savedRef.current || outputs.length === 0) return;
    if (outputs.every(o => o.status === 'done')) {
      savedRef.current = true;
      saveToHistory({
        id: Date.now().toString(), idea, textModel, imageModel, createdAt: Date.now(),
        outputs: outputs.map(o => ({ id: o.id, type: o.type, content: 'content' in o ? (o as TOut).content : undefined, url: 'url' in o ? (o as IOut).url : undefined })),
      });
    }
  }, [outputs, idea, textModel, imageModel]);

  const handleLoadHistory = (entry: HistoryEntry) => {
    sessionStorage.setItem('product_idea', entry.idea);
    sessionStorage.setItem('text_model', entry.textModel);
    sessionStorage.setItem('image_model', entry.imageModel);
    sessionStorage.setItem('history_entry', JSON.stringify(entry));
    navigate('/results');
    window.location.reload();
  };

  const handleCopy = (id: string, text: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };

  const handleRegenerate = async (id: string) => {
    const apiKey = getApiKey();
    if (!apiKey) return;
    if (TEXT_TYPES.includes(id as any)) {
      const { system, user } = TEXT_PROMPTS[id](idea);
      setOutputs(p => p.map(o => o.id === id ? { ...o, status: 'loading' } : o));
      try { const c = await generateText(system, user, apiKey, textModel); setOutputs(p => p.map(o => o.id === id ? { ...o, content: c, status: 'done' } : o)); }
      catch (e: any) { setOutputs(p => p.map(o => o.id === id ? { ...o, status: 'error', error: e.message } : o)); }
    } else {
      setOutputs(p => p.map(o => o.id === id ? { ...o, status: 'loading' } : o));
      try {
        const enhanced = await generateText(IMAGE_ENHANCER_PROMPTS[id], idea, apiKey, textModel);
        const url = getImageUrl(enhanced, IMAGE_SIZES[id].width, IMAGE_SIZES[id].height, imageModel, apiKey);
        setOutputs(p => p.map(o => o.id === id ? { ...o, url, status: 'done' } : o));
      } catch {
        const url = getImageUrl(IMAGE_PROMPTS[id](idea), IMAGE_SIZES[id].width, IMAGE_SIZES[id].height, imageModel, apiKey);
        setOutputs(p => p.map(o => o.id === id ? { ...o, url, status: 'done' } : o));
      }
    }
  };

  const doneCount = outputs.filter(o => o.status === 'done').length;
  const filtered = tab === 'all' ? BENTO.map(b => outputs.find(o => o.id === b.id)).filter(Boolean) as AnyOutput[]
    : tab === 'copy' ? outputs.filter(o => TEXT_TYPES.includes(o.type as any))
    : outputs.filter(o => IMAGE_TYPES.includes(o.type as any));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar onLoad={handleLoadHistory} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full z-[100] h-1 bg-zinc-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-1000"
          style={{ width: `${outputs.length ? (doneCount / outputs.length) * 100 : 0}%` }}
        />
      </div>

      <div className="md:flex">
        {/* Sidebar spacer on desktop */}
        <div className="hidden md:block md:w-72 flex-shrink-0" />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <nav className="sticky top-1 z-50 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center px-6 h-16">
            <button
              onClick={() => navigate('/')}
              className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
            >
              ← Back
            </button>
            <span className="text-sm text-zinc-400 truncate max-w-md text-center" title={idea}>
              "{idea}"
            </span>
            <DownloadAll outputs={outputs} idea={idea} />
          </nav>

          {/* Content */}
          <main className="px-6 py-8 max-w-5xl mx-auto">
            {/* Filter tabs */}
            <div className="flex items-center gap-6 border-b border-zinc-800 mb-6">
              {([
                { key: 'all' as const, label: `All (${outputs.length})` },
                { key: 'copy' as const, label: `Copy (${TEXT_TYPES.length})` },
                { key: 'visuals' as const, label: `Visuals (${IMAGE_TYPES.length})` },
              ]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                    tab === t.key
                      ? 'text-indigo-400 border-indigo-400'
                      : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(o => {
                const m = META[o.id];
                const isCopy = m.badge === 'copy';
                const o2 = o as TOut;
                const o3 = o as IOut;

                return (
                  <div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-md p-4 flex flex-col animate-fade-up" style={{ animationDelay: `${filtered.indexOf(o) * 60}ms` }}>
                    {/* Badge */}
                    <span className={`inline-block self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-3 ${
                      isCopy ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {isCopy ? 'Copy' : 'Visual'}
                    </span>

                    <h3 className="text-zinc-100 font-medium mb-2">{m.label}</h3>

                    {/* Content */}
                    <div className="flex-grow mb-4">
                      {o.status === 'loading' ? (
                        <div className="h-24 bg-zinc-800 rounded animate-pulse" />
                      ) : o.status === 'error' ? (
                        <div className="flex items-center gap-3">
                          <p className="text-rose-400 text-sm">{(o as any).error}</p>
                          <button
                            onClick={() => handleRegenerate(o.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                          >
                            Retry
                          </button>
                        </div>
                      ) : isCopy ? (
                        <p className="text-zinc-400 text-sm line-clamp-3 whitespace-pre-wrap">{o2.content}</p>
                      ) : (
                        <div className="rounded-md overflow-hidden bg-zinc-800">
                          {o3.url ? (
                            <img src={o3.url} alt={o.id} className="w-full h-auto object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-48 animate-pulse" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-zinc-800">
                      {isCopy ? (
                        <>
                          <button
                            onClick={() => handleCopy(o.id, o2.content)}
                            className="flex-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors py-1"
                          >
                            {copiedId === o.id ? '✓ Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleRegenerate(o.id)}
                            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors py-1"
                          >
                            Regenerate
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRegenerate(o.id)}
                            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors py-1"
                          >
                            Regenerate
                          </button>
                          {o3.url && (
                            <a
                              href={o3.url}
                              download={`${idea}-${o.id}.jpg`}
                              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors py-1 ml-auto"
                            >
                              Download
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-zinc-800 py-6 px-6 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-sm font-semibold text-zinc-100">Prompt to Market</span>
              <div className="flex gap-6">
                <a className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors" href="#">Privacy Policy</a>
                <a className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors" href="#">Terms of Service</a>
                <a className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors" href="#">API Docs</a>
              </div>
              <p className="text-xs text-zinc-500">© 2026 Prompt to Market</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
