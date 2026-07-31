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
    <div className="bg-surface-elevated border border-surface-border rounded-2xl p-5 flex flex-col hover:border-orange-500/30 hover:shadow-glow-sm transition-all duration-200 animate-fade-up">
      <span className={`inline-block self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${isCopy ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : 'bg-surface-base border border-surface-border text-ink-secondary'}`}>
        {isCopy ? 'Copy' : 'Visual'}
      </span>
      <h3 className="text-ink-primary font-semibold mb-3">{label}</h3>
      <div className="flex-grow mb-4 min-h-[80px]">
        {output.status === 'loading' ? (
          <div className="flex flex-col gap-2 h-full justify-center">
            <div className="h-2 bg-surface-border rounded animate-pulse-bar" style={{ animationDelay: '0ms' }} />
            <div className="h-2 bg-surface-border rounded animate-pulse-bar w-5/6" style={{ animationDelay: '120ms' }} />
            <div className="h-2 bg-surface-border rounded animate-pulse-bar w-4/6" style={{ animationDelay: '240ms' }} />
          </div>
        ) : output.status === 'error' ? (
          <div className="flex items-center gap-3">
            <p className="text-red-400 text-sm">{(output as any).error || 'Failed to generate'}</p>
            <button onClick={() => onRegenerate(output.id)} className="text-xs text-orange-400 hover:text-orange-300 underline">Retry</button>
          </div>
        ) : isCopy ? (
          <div>
            <p className={`text-ink-secondary text-sm leading-relaxed whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>{text.content}</p>
            {text.content && text.content.length > 150 && (
              <button onClick={onToggleExpand} className="text-xs text-orange-400 hover:text-orange-300 mt-2 transition-colors">
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden bg-surface-base border border-surface-border-subtle">
            {image.url ? <img src={image.url} alt={label} className="w-full h-auto object-cover" loading="lazy" /> : <div className="w-full h-48 animate-pulse" />}
          </div>
        )}
      </div>
      <div className="flex gap-2 pt-3 border-t border-surface-border">
        {isCopy ? (
          <>
            <button onClick={() => onCopy(output.id, text.content)} className="flex-1 text-sm text-ink-secondary hover:text-orange-400 transition-colors py-1">
              {copiedId === output.id ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={() => onRegenerate(output.id)} className="text-sm text-ink-secondary hover:text-orange-400 transition-colors py-1">Regenerate</button>
          </>
        ) : (
          <>
            <button onClick={() => onRegenerate(output.id)} className="text-sm text-ink-secondary hover:text-orange-400 transition-colors py-1">Regenerate</button>
            {image.url && <a href={image.url} download={`${label.replace(/\s+/g, '-').toLowerCase()}.jpg`} className="text-sm text-orange-400 hover:text-orange-300 transition-colors py-1 ml-auto">Download</a>}
          </>
        )}
      </div>
    </div>
  );
}
