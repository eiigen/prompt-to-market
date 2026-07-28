import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '../lib/auth';
import { generateText, getImageUrl } from '../lib/pollinations';
import { TEXT_PROMPTS, IMAGE_PROMPTS } from '../lib/prompts';
import TextOutput from '../components/TextOutput';
import ImageOutput from '../components/ImageOutput';
import DownloadAll from '../components/DownloadAll';
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
  positioning: 'Positioning Statement',
  landing: 'Landing Page Copy',
  instagram: 'Instagram Caption',
  twitter: 'Twitter/X Post',
  linkedin: 'LinkedIn Post',
  faq: 'Founder FAQ',
  hero: 'Hero Image',
  logo: 'Logo Variations',
  'social-image': 'Social Post Image',
  og: 'OG Image',
};

export default function Results() {
  const navigate = useNavigate();
  const [outputs, setOutputs] = useState<AnyOutput[]>([]);
  const [idea, setIdea] = useState('');
  const [tab, setTab] = useState<'all' | 'copy' | 'visuals'>('all');

  useEffect(() => {
    const storedIdea = sessionStorage.getItem('product_idea');
    const apiKey = getApiKey();
    if (!storedIdea || !apiKey) { navigate('/'); return; }
    setIdea(storedIdea);

    const initial: AnyOutput[] = [
      ...TEXT_TYPES.map((t) => ({ id: t, type: t as AnyOutput['type'], content: '', status: 'pending' as const })),
      ...IMAGE_TYPES.map((t) => ({ id: t, type: t as AnyOutput['type'], url: '', ...IMAGE_SIZES[t], status: 'pending' as const })),
    ];
    setOutputs(initial);

    // Fire text calls in parallel
    TEXT_TYPES.forEach(async (type) => {
      const { system, user } = TEXT_PROMPTS[type](storedIdea);
      setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, status: 'loading' } : o));
      try {
        const content = await generateText(system, user, apiKey);
        setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, content, status: 'done' } : o));
      } catch (err: any) {
        setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, status: 'error', error: err.message } : o));
      }
    });

    // Fire image calls (just URLs)
    IMAGE_TYPES.forEach((type) => {
      const prompt = IMAGE_PROMPTS[type](storedIdea);
      const { width, height } = IMAGE_SIZES[type];
      const url = getImageUrl(prompt, width, height);
      setOutputs((prev) => prev.map((o) => o.id === type ? { ...o, url, status: 'done' } : o));
    });
  }, [navigate]);

  const updateText = (id: string, content: string) =>
    setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, content } as TOut : o));
  const updateImage = (id: string, url: string) =>
    setOutputs((prev) => prev.map((o) => o.id === id ? { ...o, url } as IOut : o));

  const doneCount = outputs.filter((o) => o.status === 'done').length;
  const filtered = tab === 'all' ? outputs : tab === 'copy'
    ? outputs.filter((o) => TEXT_TYPES.includes(o.type as any))
    : outputs.filter((o) => IMAGE_TYPES.includes(o.type as any));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="text-blue-400 underline text-sm">← New idea</button>
        <h1 className="text-3xl font-bold mt-2">Launch Kit</h1>
        <p className="text-gray-400">{idea}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">{doneCount}/{outputs.length} outputs ready</p>
          <DownloadAll outputs={outputs} idea={idea} />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'copy', 'visuals'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t === 'all' ? 'All' : t === 'copy' ? '📝 Copy' : '🎨 Visuals'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((o) => (
          <div key={o.id} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
            <h3 className="font-medium mb-3 text-gray-200">{LABELS[o.type] || o.type}</h3>
            {'content' in o ? (
              <TextOutput output={o as TOut} idea={idea} onUpdate={updateText} />
            ) : (
              <ImageOutput output={o as IOut} idea={idea} onUpdate={updateImage} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
