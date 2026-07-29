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

// Bento order + span config — matches Stitch exactly
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
        // Enhance prompt via text API first
        const enhancedPrompt = await generateText(IMAGE_ENHANCER_PROMPTS[type], storedIdea, apiKey, tm);
        const url = getImageUrl(enhancedPrompt, IMAGE_SIZES[type].width, IMAGE_SIZES[type].height, im, apiKey);
        setOutputs(p => p.map(o => o.id === type ? { ...o, url, status: 'done' } : o));
      } catch {
        // Fallback: use static prompt
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

  const getSpan = (id: string) => tab !== 'all' ? '' : BENTO.find(b => b.id === id)?.span || '';

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar onLoad={handleLoadHistory} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full z-[100] h-1 bg-surface-container-high">
        <div className="h-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000"
          style={{ width: `${outputs.length ? (doneCount / outputs.length) * 100 : 0}%` }} />
        {doneCount === outputs.length && outputs.length > 0 && (
          <div className="absolute top-1 left-12 bg-surface-container-lowest px-2 py-0.5 rounded-b-md border-x border-b border-outline-variant">
            <span className="text-[10px] font-label-sm text-[#10b981] uppercase tracking-wider">All {outputs.length} assets ready</span>
          </div>
        )}
      </div>

      {/* Top Nav — exact Stitch */}
      <nav className="fixed top-1 w-full z-50 bg-surface border-b border-outline-variant flex justify-between items-center px-xl h-20 max-w-container-max mx-auto">
        <div className="w-10" />
        <span className="font-display-md text-display-md text-primary">Prompt to Market</span>
        <DownloadAll outputs={outputs} idea={idea} />
      </nav>

      {/* Main — exact Stitch bento */}
      <main className="pt-32 pb-2xl px-xl max-w-container-max mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-xl gap-lg">
          <div>
            <h1 className="font-display-md text-display-md text-on-surface mb-2">Your Marketing Kit is Ready</h1>
            <p className="text-on-surface-variant font-body-lg text-body-lg">Generated based on: "{idea}"</p>
          </div>
        </header>

        {/* Tabs — exact Stitch */}
        <div className="flex items-center gap-xl border-b border-outline-variant mb-xl">
          {[
            { key: 'all' as const, label: `All (${outputs.length})` },
            { key: 'copy' as const, label: `Copy (${TEXT_TYPES.length})` },
            { key: 'visuals' as const, label: `Visuals (${IMAGE_TYPES.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`font-label-md text-label-md pb-4 px-2 transition-all ${tab === t.key ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Bento Grid — exact Stitch, scrollable on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg overflow-x-auto">
          {filtered.map(o => {
            const m = META[o.id];
            const isCopy = m.badge === 'copy';
            const o2 = o as TOut;
            const o3 = o as IOut;

            return (
              <div key={o.id} className={`glass-card rounded-xl p-lg flex flex-col hover:border-primary transition-all ${getSpan(o.id)}`}>
                {/* Badge row */}
                <div className="flex justify-between items-start mb-md">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${isCopy ? 'bg-primary/10 text-primary' : 'bg-tertiary-container text-on-tertiary-container'}`}>
                    {isCopy ? 'Copy' : 'Visuals'}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">{m.icon}</span>
                </div>

                <h3 className="font-headline-md text-headline-md mb-2">{m.label}</h3>

                {/* Content */}
                <div className="flex-grow">
                  {o.status === 'loading' ? <div className="h-24 bg-surface-container rounded animate-pulse" />
                  : o.status === 'error' ? <p className="text-error text-sm">{(o as any).error}</p>
                  : isCopy ? (
                    o.id === 'landing' ? (
                      <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant italic text-primary-fixed mb-lg">
                        "{o2.content.split('\n').find(l => l.toLowerCase().startsWith('headline:'))?.replace(/^headline:\s*/i, '') || o2.content.split('\n')[0]}"
                      </div>
                    ) : o.id === 'faq' ? (
                      <p className="text-on-surface-variant font-body-md text-body-md line-clamp-4 whitespace-pre-wrap">{o2.content}</p>
                    ) : (
                      <p className="text-on-surface-variant font-body-md text-body-md line-clamp-4">{o2.content}</p>
                    )
                  ) : o.id === 'social-image' ? (
                    <div className="grid grid-cols-3 gap-sm mb-md">
                      {[1,2,3].map(i => (
                        <div key={i} className="aspect-square bg-surface-container rounded border border-outline-variant overflow-hidden">
                          {o3.url ? <img src={o3.url} alt={`${o.id}-${i}`} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full animate-pulse" />}
                        </div>
                      ))}
                    </div>
                  ) : o.id === 'logo' ? (
                    <div className="aspect-square bg-surface-container-high rounded-lg mb-md flex items-center justify-center border border-outline-variant">
                      {o3.url ? <img src={o3.url} alt={o.id} className="w-24 h-24 object-contain" loading="lazy" /> : <div className="w-24 h-24 animate-pulse rounded" />}
                    </div>
                  ) : (
                    <div className="relative h-48 bg-surface-container rounded-lg overflow-hidden mb-md">
                      {o3.url ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${o3.url})` }} /> : <div className="absolute inset-0 animate-pulse" />}
                    </div>
                  )}
                </div>

                {/* Actions — exact Stitch */}
                <div className="mt-lg flex gap-sm pt-md border-t border-outline-variant">
                  {isCopy ? (
                    <>
                      <button onClick={() => handleCopy(o.id, o2.content)}
                        className="flex-1 bg-surface-container-high text-on-surface font-label-md text-label-md py-2 rounded-lg flex items-center justify-center gap-xs hover:bg-surface-variant transition-colors">
                        {copiedId === o.id ? '✓ Copied!' : 'Copy'}
                      </button>
                      <button onClick={() => handleRegenerate(o.id)}
                        className="w-12 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center hover:brightness-110">↻</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleRegenerate(o.id)}
                        className="flex-1 bg-surface-container-high text-on-surface font-label-md text-label-md py-2 rounded-lg hover:bg-surface-variant transition-colors">Regenerate</button>
                      {o3.url && (
                        <a href={o3.url} download={`${idea}-${o.id}.jpg`}
                          className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-md flex items-center gap-xs hover:brightness-110">
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

      {/* Footer — exact Stitch */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-xl py-lg max-w-container-max mx-auto">
          <span className="font-title-lg text-title-lg text-on-surface mb-md md:mb-0">Prompt to Market</span>
          <div className="flex gap-lg flex-wrap justify-center mb-md md:mb-0">
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-all" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-all" href="#">Terms of Service</a>
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-all" href="#">API Docs</a>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80">© 2026 Prompt to Market. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
