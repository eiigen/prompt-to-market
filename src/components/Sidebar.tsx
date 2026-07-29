import { useState, useEffect, createContext, useContext } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '../lib/history';

const SidebarCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

interface Props {
  onLoad: (entry: HistoryEntry) => void;
}

function SidebarInner({ onLoad }: Props) {
  const { open, setOpen } = useContext(SidebarCtx);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
    const interval = setInterval(() => setHistory(getHistory()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 md:bg-black/40" />}

      <aside className={`fixed top-0 left-0 h-full z-50 w-72 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 overflow-y-auto pt-16 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 pt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">History</h2>
            {history.length > 0 && (
              <button onClick={() => { clearHistory(); setHistory([]); }} className="text-sm text-rose-500 hover:underline">Clear all</button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-zinc-500 text-sm">No generations yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((h) => (
                <div key={h.id} className="bg-zinc-800/50 hover:bg-zinc-800 rounded-md p-3 group relative transition-colors">
                  <button onClick={() => { onLoad(h); setOpen(false); }} className="text-left w-full">
                    <p className="text-sm font-medium text-zinc-100 truncate">{h.idea}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(h.createdAt).toLocaleDateString()} · {h.outputs.length} outputs
                    </p>
                  </button>
                  <button onClick={() => { deleteHistoryEntry(h.id); setHistory(getHistory()); }}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
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

function Trigger() {
  const { open, setOpen } = useContext(SidebarCtx);
  return (
    <button onClick={() => setOpen(!open)} className="text-zinc-400 hover:text-indigo-400 p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="5" x2="17" y2="5" />
        <line x1="3" y1="10" x2="17" y2="10" />
        <line x1="3" y1="15" x2="17" y2="15" />
      </svg>
    </button>
  );
}

export default function Sidebar({ onLoad }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <SidebarCtx.Provider value={{ open, setOpen }}>
      <SidebarInner onLoad={onLoad} />
    </SidebarCtx.Provider>
  );
}

Sidebar.Trigger = Trigger;
