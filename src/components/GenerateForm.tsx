import { useState, useEffect, useRef } from 'react';
import { getApiKey, initiateAuth, logout } from '../lib/auth';
import { fetchModels, type ModelInfo } from '../lib/prompts';

interface Props {
  onGenerate: (idea: string, textModel: string, imageModel: string) => void;
  isLoading: boolean;
}

function InfoTip({ text, children }: { text: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <span onClick={() => setOpen(!open)} className="cursor-pointer">{children}</span>
      {open && (
        <span className="absolute bottom-full left-0 mb-2 w-64 p-2.5 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs leading-relaxed z-50 shadow-lg break-words">
          {text}
        </span>
      )}
    </span>
  );
}

function ModelSelect({ models, value, onChange, placeholder }: { models: ModelInfo[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const selected = models.find(m => m.name === value);
  const filtered = search ? models.filter(m => m.name.includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase())) : models;

  return (
    <div className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm px-3 py-1.5 rounded-md text-left flex justify-between items-center">
        <span className="truncate">{selected?.title || placeholder}</span>
        <span className="text-zinc-400 ml-1">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl max-h-60 overflow-hidden flex flex-col">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..." autoFocus
            className="bg-zinc-900 text-zinc-100 text-sm px-3 py-1.5 border-b border-zinc-700 outline-none focus:border-indigo-500" />
          <div className="overflow-y-auto">
            {filtered.length === 0 && <div className="px-3 py-1.5 text-zinc-500 text-sm">No models found</div>}
            {filtered.map(m => (
              <button key={m.name} type="button" onClick={() => { onChange(m.name); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-700 transition-colors ${m.name === value ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-100'}`}>
                <div className="truncate">{m.title}</div>
                {m.description && <div className="text-[10px] text-zinc-500 truncate">{m.description}</div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GenerateForm({ onGenerate, isLoading }: Props) {
  const [idea, setIdea] = useState('');
  const [textModel, setTextModel] = useState('openai');
  const [imageModel, setImageModel] = useState('flux');
  const [textModels, setTextModels] = useState<ModelInfo[]>([]);
  const [imageModels, setImageModels] = useState<ModelInfo[]>([]);
  const apiKey = getApiKey();

  useEffect(() => {
    fetchModels().then(({ text, image }) => { setTextModels(text); setImageModels(image); });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    if (!apiKey) { initiateAuth(); return; }
    onGenerate(idea.trim(), textModel, imageModel);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3">
        <input type="text" value={idea} onChange={e => setIdea(e.target.value)}
          placeholder="Describe your product idea (e.g., A subscription box for plant lovers)..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-100 px-4 py-3 text-base placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          disabled={isLoading} />
        <button type="submit" disabled={isLoading || !idea.trim()}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 whitespace-nowrap hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0">
          {isLoading ? 'Generating...' : apiKey ? 'Generate Launch Kit' : 'Connect & Generate'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 px-1 relative z-20">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-zinc-400 whitespace-nowrap flex items-center gap-1">
            Text:
            <InfoTip text="Recommended: deepseek, deepseek-pro, glm, or any Kimi variants for best results.">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 text-[11px] font-bold hover:bg-zinc-600 hover:text-white transition-colors select-none">!</span>
            </InfoTip>
          </label>
          <ModelSelect models={textModels} value={textModel} onChange={setTextModel} placeholder="Select text model" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-zinc-400 whitespace-nowrap flex items-center gap-1">
            Image:
            <InfoTip text="Use a better image model — smaller ones aren't accurate. FLUX or larger models recommended.">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 text-[11px] font-bold hover:bg-zinc-600 hover:text-white transition-colors select-none">!</span>
            </InfoTip>
          </label>
          <ModelSelect models={imageModels} value={imageModel} onChange={setImageModel} placeholder="Select image model" />
        </div>
      </div>
      <div className="text-sm text-zinc-400 px-1">
        {apiKey ? (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Connected
            <button type="button" onClick={logout} className="text-indigo-400 hover:text-indigo-300 underline ml-1">Disconnect</button>
          </span>
        ) : (
          <span>Connect Pollinations to start generating</span>
        )}
      </div>
    </form>
  );
}
