import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '../lib/auth';
import { generateText, getImageUrl } from '../lib/pollinations';
import { TEXT_PROMPTS, IMAGE_PROMPTS } from '../lib/prompts';
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
const LABELS: Record<string, string> = {
  positioning: 'Positioning',
  landing: 'Landing Page H1',
  instagram: 'Instagram Caption',
  twitter: 'Twitter Thread',
  linkedin: 'LinkedIn Post',
  faq: 'Founder FAQ',
  hero: 'Hero Image',
  logo: 'Logo Mark',
  'social-image': 'Social Post Grid',
  og: 'OG Image',
};
const ICONS: Record<string, string> = {
  positioning: 'description', landing: 'web', instagram: 'share', twitter: 'tag',
  linkedin: 'work', faq: 'help', hero: 'image', logo: 'diamond',
  'social-image': 'grid_view', og: 'language',
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
    const storedTextModel = sessionStorage.getItem('text_model') || 'openai';
    const storedImageModel = sessionStorage.getItem('image_model') || 'flux';
    if (!storedIdea || !apiKey) { navigate('/'); return; }
    setIdea(storedIdea);
    setTextModel(storedTextModel);
    setImageModel(storedImageModel);

    // Check if loading from history
    const historyEntry = sessionStorage.getItem('history_entry');
    if (historyEntry) {
      try {
        const entry: HistoryEntry = JSON.parse(historyEntry);
        const restored: AnyOutput[] = entry.outputs.map(o => {
          if (TEXT_TYPES.includes(o.type as any)) {
            return { id: o.id, type: o.type as AnyOutput['type'], content: o.content || '', status: 'done' as const };
          }
          return { id: o.id, type: o.type as AnyOutput['type'], url: o.url || '', ...IMAGE_SIZES[o.id], status: 'done' as const };
        });
        setOutputs(restored);
        sessionStorage.removeItem('history_entry');
        return;
      } catch {}
    }

    // Fresh generation
    const initial: AnyOutput[] = [
      ...TEXT_TYPES.map((t) => ({ id: t, type: t as AnyOutput['type'], content: '', status: 'pending' as const })),
      ...IMAGE_TYPES.map((t) => ({ id: t, type: t as AnyOutput['type'], url: '', ...IMAGE_SIZES[t], status: 'pending' as const })),
    ];
    setOutputs(initial);

    TEXT_TYPES.forEach(async (type) => {
      const { system, user } = TEXT_PROMPTS[type](storedIdea);
      setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, status: 'loading' } : o));
      try {
        const content = await generateText(system, user, apiKey, storedTextModel);
        setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, content, status: 'done' } : o));
      } catch (err: any) {
        setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, status: 'error', error: err.message } : o));
      }
    });

    IMAGE_TYPES.forEach((type) => {
      const prompt = IMAGE_PROMPTS[type](storedIdea);
      const { width, height } = IMAGE_SIZES[type];
      const url = getImageUrl(prompt, width, height, storedImageModel);
      setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, url, status: 'done' } : o));
    });
  }, [navigate]);

  // Save to history when all done
  useEffect(() => {
    if (savedRef.current) return;
    const doneCount = outputs.filter(o => o.status === 'done').length;
    if (outputs.length > 0 && doneCount === outputs.length) {
      savedRef.current = true;
      saveToHistory({
        id: Date.now().toString(),
        idea,
        textModel,
        imageModel,
        createdAt: Date.now(),
        outputs: outputs.map(o => ({
          id: o.id,
          type: o.type,
          content: 'content' in o ? (o as TOut).content : undefined,
          url: 'url' in o ? (o as IOut).url : undefined,
        })),
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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async (id: string) => {
    const apiKey = getApiKey();
    if (!apiKey) return;
    if (TEXT_TYPES.includes(id as any)) {
      const { system, user } = TEXT_PROMPTS[id](idea);
      setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, status: 'loading' } : o));
      try {
        const content = await generateText(system, user, apiKey, textModel);
        setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, content, status: 'done' } : o));
      } catch (err: any) {
        setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, status: 'error', error: err.message } : o));
      }
    } else {
      const prompt = IMAGE_PROMPTS[id](idea);
      const { width, height } = IMAGE_SIZES[id];
      const url = getImageUrl(prompt, width, height, imageModel);
      setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, url, status: 'done' } : o));
    }
  };

  const doneCount = outputs.filter((o) => o.status === 'done').length;
  const isCopy = (id: string) => TEXT_TYPES.includes(id as any);
  const bentoOrder = ['hero', 'positioning', 'landing', 'logo', 'instagram', 'social-image', 'twitter', 'linkedin', 'og', 'faq'];
  const ordered = tab === 'all'
    ? bentoOrder.map(id => outputs.find(o => o.id === id)).filter(Boolean) as AnyOutput[]
    : tab === 'copy' ? outputs.filter(o => TEXT_TYPES.includes(o.type as any)) : outputs.filter(o => IMAGE_TYPES.includes(o.type as any));
  const getSpan = (id: string) => tab !== 'all' ? '' : (id === 'hero' || id === 'social-image') ? 'md:col-span-2' : '';

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar onLoad={handleLoadHistory} />

      <div className="fixed top-0 left-0 w-full z-[100] h-1 bg-surface-container-high">
        <div className="h-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000"
          style={{ width: `${outputs.length ? (doneCount / outputs.length) * 100 : 0}%` }} />
        {doneCount === outputs.length && outputs.length > 0 && (
          <div className="absolute top-1 left-12 bg-surface-container-lowest px-2 py-0.5 rounded-b-md border-x border-b border-outline-variant">
            <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">All {outputs.length} assets ready</span>
          </div>
        )}
      </div>

      <nav className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant flex justify-between items-center px-xl h-20 max-w-container-max mx-auto">
        <div className="w-10" />
        <button onClick={() => navigate('/')} className="text-display-md font-bold text-primary">Prompt to Market</button>
        <DownloadAll outputs={outputs} idea={idea} />
      </nav>

      <main className="pt-32 pb-2xl px-xl max-w-container-max mx-auto">
        <header className="mb-xl">
          <h1 className="text-display-md text-on-surface mb-2">Your Marketing Kit is Ready</h1>
          <p className="text-on-surface-variant text-body-lg">Generated based on: "{idea}"</p>
        </header>

        <div className="flex items-center gap-xl border-b border-outline-variant mb-xl">
          {[
            { key: 'all', label: `All (${outputs.length})` },
            { key: 'copy', label: `Copy (${TEXT_TYPES.length})` },
            { key: 'visuals', label: `Visuals (${IMAGE_TYPES.length})` },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`text-label-md pb-4 px-2 transition-all ${tab === t.key ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {ordered.map((o) => {
            const copy = isCopy(o.id);
            const o2 = o as TOut;
            const o3 = o as IOut;
            return (
              <div key={o.id} className={`glass-card rounded-xl p-lg flex flex-col hover:border-primary transition-all ${getSpan(o.id)}`}>
                <div className="flex justify-between items-start mb-md">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${copy ? 'bg-primary/10 text-primary' : 'bg-tertiary-container text-on-tertiary-container'}`}>
                    {copy ? 'Copy' : 'Visuals'}
                  </span>
                  <span className="text-on-surface-variant text-xl material-symbols-outlined">{ICONS[o.id]}</span>
                </div>
                <h3 className="text-headline-md mb-2">{LABELS[o.id]}</h3>
                <div className="flex-grow">
                  {o.status === 'loading' ? <div className="h-24 bg-surface-container rounded animate-pulse" />
                   : o.status === 'error' ? <p className="text-error text-sm">{(o as any).error}</p>
                   : copy ? (
                    o.id === 'landing' ? (
                      <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant italic text-primary-fixed">
                        {o2.content.split('\n').find(l => l.toLowerCase().startsWith('headline:'))?.replace(/^headline:\s*/i, '') || o2.content.split('\n')[0]}
                      </div>
                    ) : o.id === 'faq' ? (
                      <p className="text-on-surface-variant text-body-md line-clamp-4 whitespace-pre-wrap">{o2.content}</p>
                    ) : (
                      <p className="text-on-surface-variant text-body-md line-clamp-4">{o2.content}</p>
                    )
                  ) : (
                    <div className={`${o.id === 'social-image' ? 'grid grid-cols-3 gap-sm' : 'aspect-square'} bg-surface-container rounded-lg overflow-hidden`}>
                      {o.id === 'social-image' ? (
                        [1,2,3].map(i => (
                          <div key={i} className="aspect-square bg-surface-container-high rounded border border-outline-variant overflow-hidden">
                            {o3.url ? <img src={o3.url} alt={`${o.id}-${i}`} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full animate-pulse" />}
                          </div>
                        ))
                      ) : o3.url ? <img src={o3.url} alt={o.id} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-surface-container-high animate-pulse" />}
                    </div>
                  )}
                </div>
                <div className="mt-lg flex gap-sm pt-md border-t border-outline-variant">
                  {copy ? (
                    <>
                      <button onClick={() => handleCopy(o.id, o2.content)}
                        className="flex-1 bg-surface-container-high text-on-surface text-label-md py-2 rounded-lg flex items-center justify-center gap-xs hover:bg-surface-variant transition-colors">
                        {copiedId === o.id ? '✓ Copied!' : 'Copy'}
                      </button>
                      <button onClick={() => handleRegenerate(o.id)} className="w-12 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center hover:brightness-110">↻</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleRegenerate(o.id)} className="flex-1 bg-surface-container-high text-on-surface text-label-md py-2 rounded-lg hover:bg-surface-variant transition-colors">Regenerate</button>
                      {o3.url && <a href={o3.url} download={`${idea}-${o.id}.jpg`} className="bg-primary text-on-primary px-lg py-2 rounded-lg text-label-md flex items-center gap-xs hover:brightness-110">Download</a>}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-xl py-lg max-w-container-max mx-auto">
          <span className="text-title-lg text-on-surface">Prompt to Market</span>
          <p className="text-label-sm text-on-surface-variant opacity-80">© 2026 Prompt to Market.</p>
        </div>
      </footer>
    </div>
  );
}
