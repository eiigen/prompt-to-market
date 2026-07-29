import { useState, useEffect } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '../lib/history';

interface Props {
  onLoad: (entry: HistoryEntry) => void;
}

export default function Sidebar({ onLoad }: Props) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
    const interval = setInterval(() => setHistory(getHistory()), 2000);
    return () => clearInterval(interval);
  }, []);

  // Desktop: always visible. Mobile: hamburger toggle.
  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} className="md:hidden fixed top-5 left-4 z-50 text-on-surface-variant hover:text-primary p-2">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} className="md:hidden fixed inset-0 z-40 bg-black/40" />}

      {/* Sidebar — always visible on desktop, slide-in on mobile */}
      <aside className={`fixed md:sticky md:top-20 left-0 h-full z-50 w-72 bg-surface-container-low border-r border-outline-variant transform transition-transform duration-200 overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}>
        <div className="p-lg pt-16 md:pt-lg">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="text-title-lg text-on-surface">History</h2>
            {history.length > 0 && (
              <button onClick={() => { clearHistory(); setHistory([]); }} className="text-label-sm text-error hover:underline">Clear all</button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-on-surface-variant text-body-md">No generations yet.</p>
          ) : (
            <div className="flex flex-col gap-sm">
              {history.map((h) => (
                <div key={h.id} className="glass-card rounded-lg p-md group relative">
                  <button onClick={() => { onLoad(h); setOpen(false); }} className="text-left w-full">
                    <p className="text-label-md text-on-surface truncate">{h.idea}</p>
                    <p className="text-label-sm text-on-surface-variant mt-xs">
                      {new Date(h.createdAt).toLocaleDateString()} · {h.outputs.length} outputs
                    </p>
                  </button>
                  <button onClick={() => { deleteHistoryEntry(h.id); setHistory(getHistory()); }}
                    className="absolute top-2 right-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity text-label-sm">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}