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
    <aside className={`h-full bg-surface-elevated border-r border-surface-border flex flex-col ${className}`}>
      <div className="p-5 border-b border-surface-border">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-secondary">History</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <p className="text-ink-muted text-sm">No generations yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((h) => (
              <div key={h.id} className="group relative bg-surface-base border border-surface-border-subtle rounded-xl p-3 hover:border-orange-500/40 transition-all duration-200">
                <button onClick={() => onLoad(h)} className="text-left w-full">
                  <p className="text-sm font-medium text-ink-primary truncate pr-4">{h.idea}</p>
                  <p className="text-xs text-ink-muted mt-1">{new Date(h.createdAt).toLocaleDateString()} · {h.outputs.length} outputs</p>
                </button>
                <button
                  onClick={() => { deleteHistoryEntry(h.id); setHistory(getHistory()); }}
                  className="absolute top-2 right-2 text-ink-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  aria-label={`Delete ${h.idea}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {history.length > 0 && (
        <div className="p-4 border-t border-surface-border">
          <button
            onClick={() => { clearHistory(); setHistory([]); }}
            className="w-full text-xs text-ink-secondary hover:text-red-400 transition-colors"
          >
            Clear all history
          </button>
        </div>
      )}
    </aside>
  );
}
