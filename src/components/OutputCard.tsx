import type { AnyOutput, TextOutput, ImageOutput } from '../lib/types';

interface Props {
  output: AnyOutput;
  label: string;
  isCopy: boolean;
  copiedId: string | null;
  expanded: boolean;
  onCopy: (id: string, text: string) => void;
  onRegenerate: (id: string) => void;
  onToggleExpand: () => void;
}

export default function OutputCard({ output, label, isCopy, copiedId, expanded, onCopy, onRegenerate, onToggleExpand }: Props) {
  const text = output as TextOutput;
  const image = output as ImageOutput;

  return (
    <div className="p-4 flex flex-col h-full border border-transparent hover:border-hazard/30 transition-colors duration-200">
      <span className={`inline-block self-start px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em] mb-3 ${isCopy ? 'bg-hazard/10 text-hazard border border-hazard/30' : 'bg-[#0A0A0A] border border-[#1E1E1E] text-[#909090]'}`}>
        {isCopy ? '[ COPY ]' : '[ VISUAL ]'}
      </span>
      <h3 className="text-[#EAEAEA] font-mono text-sm uppercase tracking-[0.1em] mb-3">{label}</h3>
      <div className="flex-grow mb-4 min-h-[80px]">
        {output.status === 'loading' ? (
          <div className="flex flex-col gap-2 h-full justify-center">
            <div className="h-1.5 bg-[#1E1E1E] animate-pulse-bar" style={{ animationDelay: '0ms' }} />
            <div className="h-1.5 bg-[#1E1E1E] animate-pulse-bar w-5/6" style={{ animationDelay: '120ms' }} />
            <div className="h-1.5 bg-[#1E1E1E] animate-pulse-bar w-4/6" style={{ animationDelay: '240ms' }} />
          </div>
        ) : output.status === 'error' ? (
          <div className="flex items-center gap-3">
            <p className="text-hazard text-[11px] font-mono">{(output as any).error || 'FAILED TO GENERATE'}</p>
            <button onClick={() => onRegenerate(output.id)} className="text-[11px] text-hazard hover:opacity-80 underline font-mono">[RETRY]</button>
          </div>
        ) : isCopy ? (
          <div>
            <p className={`text-[#909090] text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>{text.content}</p>
            {text.content && text.content.length > 150 && (
              <button onClick={onToggleExpand} className="text-[11px] text-hazard hover:opacity-80 mt-2 transition-colors font-mono">
                {expanded ? '[SHOW LESS]' : '[SHOW MORE]'}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden bg-[#0A0A0A] border border-[#1E1E1E]">
            {image.url || image.dataUrl ? <img src={image.dataUrl || image.url} alt={label} className="w-full h-auto object-cover" loading="lazy" /> : <div className="w-full h-48 animate-pulse bg-[#1E1E1E]" />}
          </div>
        )}
      </div>
      <div className="flex gap-3 pt-3 border-t border-[#1E1E1E] mt-auto">
        {isCopy ? (
          <>
            <button onClick={() => onCopy(output.id, text.content)} className="flex-1 text-[11px] font-mono text-[#909090] hover:text-hazard transition-colors py-1 uppercase tracking-[0.05em]">
              {copiedId === output.id ? '✓ COPIED' : '[COPY]'}
            </button>
            <button onClick={() => onRegenerate(output.id)} className="text-[11px] font-mono text-[#909090] hover:text-hazard transition-colors py-1 uppercase tracking-[0.05em]">[REGENERATE]</button>
          </>
        ) : (
          <>
            <button onClick={() => onRegenerate(output.id)} className="text-[11px] font-mono text-[#909090] hover:text-hazard transition-colors py-1 uppercase tracking-[0.05em]">[REGENERATE]</button>
            {image.url && <a href={image.dataUrl || image.url} download={`${label.replace(/\s+/g, '-').toLowerCase()}.jpg`} className="text-[11px] font-mono text-hazard hover:opacity-80 transition-colors py-1 ml-auto uppercase tracking-[0.05em]">[DOWNLOAD]</a>}
          </>
        )}
      </div>
    </div>
  );
}