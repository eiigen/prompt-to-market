import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '../lib/auth';
import { generateText, getImageUrl } from '../lib/pollinations';
import { TEXT_PROMPTS, IMAGE_PROMPTS, IMAGE_ENHANCER_PROMPTS } from '../lib/prompts';
import { saveToHistory, type HistoryEntry } from '../lib/history';
import DownloadAll from '../components/DownloadAll';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import OutputCard from '../components/OutputCard';
import EmptyState from '../components/EmptyState';
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

const META: Record<string, { label: string; badge: 'copy' | 'visual' }> = {
  positioning: { label: 'Positioning', badge: 'copy' },
  landing: { label: 'Landing Page H1', badge: 'copy' },
  instagram: { label: 'Instagram Caption', badge: 'copy' },
  twitter: { label: 'Twitter/X Post', badge: 'copy' },
  linkedin: { label: 'LinkedIn Post', badge: 'copy' },
  faq: { label: 'Founder FAQ', badge: 'copy' },
  hero: { label: 'Hero Image', badge: 'visual' },
  logo: { label: 'Logo Mark', badge: 'visual' },
  'social-image': { label: 'Social Post Grid', badge: 'visual' },
  og: { label: 'OG Image', badge: 'visual' },
};

export default function Results() {
  const navigate = useNavigate();
  const [outputs, setOutputs] = useState<AnyOutput[]>([]);
  const [idea, setIdea] = useState('');
  const [textModel, setTextModel] = useState('openai');
  const [imageModel, setImageModel] = useState('flux');
  const [tab, setTab] = useState<'all' | 'copy' | 'visuals'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

    const initial: AnyOutput[] = [
      ...TEXT_TYPES.map(t => ({ id: t, type: t as AnyOutput['type'], content: '', status: 'pending' as const })),
      ...IMAGE_TYPES.map(t => ({ id: t, type: t as AnyOutput['type'], url: '', ...IMAGE_SIZES[t], status: 'pending' as const })),
    ];
    setOutputs(initial);

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

  if (!idea && outputs.length === 0) {
    return (
      <div className="min-h-screen bg-surface-base text-ink-primary flex">
        <div className="hidden md:block w-72 flex-shrink-0">
          <Sidebar onLoad={handleLoadHistory} className="fixed top-0 left-0 w-72 h-screen" />
        </div>
        <div className="flex-1 min-w-0">
          <nav className="sticky top-0 z-30 flex justify-between items-center w-full px-4 py-4 bg-surface-base/90 backdrop-blur border-b border-surface-border">
            <span className="text-lg font-bold text-ink-primary">Prompt to Market</span>
          </nav>
          <main className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
            <EmptyState />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary flex">
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 md:hidden" />
      )}

      <div className="hidden md:block w-72 flex-shrink-0">
        <Sidebar onLoad={handleLoadHistory} className="fixed top-0 left-0 w-72 h-screen" />
      </div>

      <div className={`fixed top-0 left-0 z-50 h-full transform transition-transform duration-200 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onLoad={(e) => { handleLoadHistory(e); setSidebarOpen(false); }} className="w-72 pt-14" />
      </div>

      <ProgressBar value={outputs.length ? (doneCount / outputs.length) * 100 : 0} />

      <div className="flex-1 min-w-0 flex flex-col">
        <nav className="sticky top-0 z-30 bg-surface-base/90 backdrop-blur border-b border-surface-border flex justify-between items-center px-4 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-ink-secondary hover:text-orange-400 p-1.5 rounded-md hover:bg-surface-elevated transition-colors"
              aria-label="Toggle history sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            </button>
            <button onClick={() => navigate('/')} className="text-ink-secondary hover:text-ink-primary transition-colors text-sm">← Back</button>
          </div>
          <span className="text-sm text-ink-secondary truncate max-w-md text-center hidden sm:block" title={idea}>"{idea}"</span>
          <DownloadAll outputs={outputs} idea={idea} />
        </nav>

        <main className="px-4 md:px-6 py-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-6 border-b border-surface-border mb-6">
            {([
              { key: 'all' as const, label: `All (${outputs.length})` },
              { key: 'copy' as const, label: `Copy (${TEXT_TYPES.length})` },
              { key: 'visuals' as const, label: `Visuals (${IMAGE_TYPES.length})` }
            ]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === t.key ? 'text-orange-400 border-orange-400' : 'text-ink-muted border-transparent hover:text-ink-secondary'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((o, idx) => {
              const m = META[o.id];
              const isCopy = m.badge === 'copy';
              const span = tab === 'all' ? BENTO.find(b => b.id === o.id)?.span || '' : '';
              return (
                <div key={o.id} className={span} style={{ animationDelay: `${idx * 60}ms` }}>
                  <OutputCard
                    output={o}
                    label={m.label}
                    isCopy={isCopy}
                    copiedId={copiedId}
                    expanded={expandedId === o.id}
                    onCopy={handleCopy}
                    onRegenerate={handleRegenerate}
                    onToggleExpand={() => setExpandedId(expandedId === o.id ? null : o.id)}
                  />
                </div>
              );
            })}
          </div>
        </main>

        <footer className="border-t border-surface-border py-6 px-6 bg-surface-sunken mt-auto">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm font-semibold text-ink-primary">Prompt to Market</span>
            <div className="flex gap-6">
              <a className="text-xs text-ink-muted hover:text-orange-400 transition-colors" href="#">Privacy Policy</a>
              <a className="text-xs text-ink-muted hover:text-orange-400 transition-colors" href="#">Terms of Service</a>
              <a className="text-xs text-ink-muted hover:text-orange-400 transition-colors" href="#">API Docs</a>
            </div>
            <p className="text-xs text-ink-muted">© 2026 Prompt to Market</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
