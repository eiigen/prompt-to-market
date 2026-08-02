import { useState, useEffect } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '../lib/history';

interface SidebarProps {
  onLoad: (entry: HistoryEntry) => void;
  className?: string;
}

export default function Sidebar({ onLoad, className = '' }: SidebarProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
    const interval = setInterval(() => setHistory(getHistory()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className={`h-full bg-[#121212] border-r border-[#1E1E1E] font-mono flex flex-col ${className}`}>
      <div className="p-5 border-b border-[#1E1E1E]">
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-[#EAEAEA]">
          <span className="text-hazard-dim">[ </span>HISTORY<span className="text-hazard-dim"> ]</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <p className="text-[11px] text-[#505050]">&gt; NO GENERATIONS YET</p>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((h) => (
              <div key={h.id} className="group relative bg-[#0A0A0A] border border-[#1E1E1E] hover:border-hazard transition-colors duration-200">
                <button onClick={() => onLoad(h)} className="text-left w-full p-3 pr-8">
                  <p className="text-[11px] text-[#EAEAEA] truncate pr-2 uppercase tracking-[0.05em]">{h.idea}</p>
                  <p className="text-[10px] text-[#505050] mt-1">{new Date(h.createdAt).toLocaleDateString()} · {h.outputs.length} OUTPUTS</p>
                </button>
                <button
                  onClick={() => { deleteHistoryEntry(h.id); setHistory(getHistory()); }}
                  className="absolute top-2 right-2 text-[#505050] hover:text-hazard transition-colors text-[10px]"
                  aria-label={`Delete ${h.idea}`}
                >
                  [✕]
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {history.length > 0 && (
        <div className="p-4 border-t border-[#1E1E1E]">
          <button
            onClick={() => { clearHistory(); setHistory([]); }}
            className="w-full text-[10px] uppercase tracking-[0.1em] text-[#505050] hover:text-hazard transition-colors text-left"
          >
            [CLEAR ALL]
          </button>
        </div>
      )}
    </aside>
  );
}
