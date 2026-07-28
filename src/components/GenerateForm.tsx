import { useState, useEffect } from 'react';
import { getApiKey, initiateAuth, logout } from '../lib/auth';
import { fetchModels, type ModelInfo } from '../lib/prompts';

interface Props {
  onGenerate: (idea: string, textModel: string, imageModel: string) => void;
  isLoading: boolean;
}

function ModelSelect({ models, value, onChange, placeholder }: { models: ModelInfo[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const selected = models.find(m => m.name === value);
  const filtered = search ? models.filter(m => m.name.includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase())) : models;

  return (
    <div className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-surface-container-low text-on-surface text-label-md px-sm py-xs rounded-lg border border-outline-variant text-left flex justify-between items-center">
        <span className="truncate">{selected?.title || placeholder}</span>
        <span className="text-on-surface-variant ml-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-container border border-outline-variant rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." autoFocus
            className="bg-surface-container-low text-on-surface text-label-md px-sm py-xs border-b border-outline-variant outline-none" />
          <div className="overflow-y-auto">
            {filtered.length === 0 && <div className="px-sm py-xs text-on-surface-variant text-label-md">No models found</div>}
            {filtered.map(m => (
              <button key={m.name} type="button" onClick={() => { onChange(m.name); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-sm py-xs text-label-md hover:bg-surface-container-high transition-colors ${m.name === value ? 'text-primary bg-primary/10' : 'text-on-surface'}`}>
                <div className="truncate">{m.title}</div>
                {m.description && <div className="text-[10px] text-on-surface-variant truncate">{m.description}</div>}
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="glass-card p-sm rounded-xl shadow-2xl flex flex-col gap-sm">
        <div className="flex flex-col md:flex-row gap-sm">
          <input type="text" value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="Describe your product idea..."
            className="flex-1 bg-surface-container-low border-none focus:ring-1 focus:ring-primary text-on-surface py-lg pl-md pr-md rounded-lg text-body-md placeholder:text-outline"
            disabled={isLoading} />
          <button type="submit" disabled={isLoading || !idea.trim()}
            className="bg-[#3B82F6] hover:bg-blue-600 text-white px-2xl py-lg rounded-lg text-label-md transition-all flex items-center justify-center gap-sm group disabled:opacity-50">
            {isLoading ? 'Generating...' : apiKey ? 'Generate Launch Kit' : 'Connect & Generate'}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-sm px-sm pb-xs">
          <div className="flex items-center gap-sm flex-1">
            <label className="text-label-sm text-on-surface-variant whitespace-nowrap">Text:</label>
            <ModelSelect models={textModels} value={textModel} onChange={setTextModel} placeholder="Select text model" />
          </div>
          <div className="flex items-center gap-sm flex-1">
            <label className="text-label-sm text-on-surface-variant whitespace-nowrap">Image:</label>
            <ModelSelect models={imageModels} value={imageModel} onChange={setImageModel} placeholder="Select image model" />
          </div>
        </div>
      </div>
      <div className="mt-md text-sm text-on-surface-variant">
        {apiKey ? <span>Connected ✓ <button type="button" onClick={logout} className="underline hover:text-primary">Disconnect</button></span> : <span>Connect Pollinations to start generating</span>}
      </div>
    </form>
  );
}
