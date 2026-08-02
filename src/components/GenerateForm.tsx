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
        <span className="absolute bottom-full left-0 mb-2 w-52 max-w-[85vw] p-3 border border-hazard bg-hazard-glow text-[#EAEAEA] text-[11px] leading-relaxed z-50 break-words whitespace-normal">
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
        className="w-full bg-[#121212] border border-[#1E1E1E] text-[#EAEAEA] text-[11px] font-mono px-3 py-1.5 text-left flex justify-between items-center hover:border-hazard transition-colors">
        <span className="truncate uppercase tracking-[0.05em]">{selected?.title || placeholder}</span>
        <span className="text-[#505050] ml-1">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-[#121212] border border-[#1E1E1E] max-h-60 overflow-hidden flex flex-col">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..." autoFocus
            className="bg-[#0A0A0A] text-[#EAEAEA] text-[11px] font-mono px-3 py-1.5 border-b border-[#1E1E1E] outline-none focus:border-hazard" />
          <div className="overflow-y-auto">
            {filtered.length === 0 && <div className="px-3 py-1.5 text-[#505050] text-[11px] font-mono">NO MODELS FOUND</div>}
            {filtered.map(m => (
              <button key={m.name} type="button" onClick={() => { onChange(m.name); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-1.5 text-[11px] font-mono hover:bg-[#0A0A0A] transition-colors ${m.name === value ? 'text-hazard bg-hazard-glow' : 'text-[#EAEAEA]'}`}>
                <div className="truncate uppercase tracking-[0.05em]">{m.title}</div>
                {m.description && <div className="text-[10px] text-[#505050] truncate">{m.description}</div>}
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
      <div className="flex flex-col md:flex-row gap-0.5">
        <input type="text" value={idea} onChange={e => setIdea(e.target.value)}
          placeholder="Describe your product idea..."
          className="flex-1 bg-[#0A0A0A] border border-[#1E1E1E] text-[#EAEAEA] font-mono px-4 py-3 text-sm placeholder:text-[#505050] focus:border-hazard outline-none transition-colors"
          disabled={isLoading} />
        <button type="submit" disabled={isLoading || !idea.trim()}
          className="bg-hazard hover:bg-hazard-dim text-[#EAEAEA] font-mono px-6 py-3 text-sm uppercase tracking-[0.1em] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap active:scale-[0.98]">
          {isLoading ? 'GENERATING...' : apiKey ? '> GENERATE' : '> CONNECT & GENERATE'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 px-0.5 relative z-20">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-[11px] text-[#909090] font-mono uppercase tracking-[0.1em] flex items-center gap-1">
            TEXT:
            <InfoTip text="Recommended: deepseek, deepseek-pro, glm, or any Kimi variants for best results.">
              <span className="inline-flex items-center justify-center w-4 h-4 border border-[#1E1E1E] text-[#909090] text-[10px] font-mono hover:border-hazard hover:text-hazard transition-colors select-none">?</span>
            </InfoTip>
          </label>
          <ModelSelect models={textModels} value={textModel} onChange={setTextModel} placeholder="SELECT MODEL" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <label className="text-[11px] text-[#909090] font-mono uppercase tracking-[0.1em] flex items-center gap-1">
            IMAGE:
            <InfoTip text="Use a larger image model for more accurate visuals.">
              <span className="inline-flex items-center justify-center w-4 h-4 border border-[#1E1E1E] text-[#909090] text-[10px] font-mono hover:border-hazard hover:text-hazard transition-colors select-none">?</span>
            </InfoTip>
          </label>
          <ModelSelect models={imageModels} value={imageModel} onChange={setImageModel} placeholder="SELECT MODEL" />
        </div>
      </div>
      <div className="text-[11px] font-mono text-[#909090] px-0.5">
        {apiKey ? (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 bg-phosphor animate-terminal-blink" />
            CONNECTED
            <button type="button" onClick={logout} className="text-hazard hover:opacity-80 underline ml-1">[DISCONNECT]</button>
          </span>
        ) : (
          <span><span className="text-hazard-dim">&gt;&gt;</span> Connect Pollinations to start generating</span>
        )}
      </div>
    </form>
  );
}