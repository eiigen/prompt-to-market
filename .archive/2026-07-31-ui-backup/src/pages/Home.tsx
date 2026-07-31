import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getApiKey } from '../lib/auth';
import { getHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '../lib/history';
import GenerateForm from '../components/GenerateForm';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const connected = !!getApiKey();

  useEffect(() => {
    setHistory(getHistory());
    const interval = setInterval(() => setHistory(getHistory()), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = (idea: string, textModel: string, imageModel: string) => {
    setIsLoading(true);
    sessionStorage.setItem('product_idea', idea);
    sessionStorage.setItem('text_model', textModel);
    sessionStorage.setItem('image_model', imageModel);
    navigate('/results');
  };

  const handleLoadHistory = (entry: HistoryEntry) => {
    sessionStorage.setItem('product_idea', entry.idea);
    sessionStorage.setItem('text_model', entry.textModel);
    sessionStorage.setItem('image_model', entry.imageModel);
    sessionStorage.setItem('history_entry', JSON.stringify(entry));
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar overlay — mobile only */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60" />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-72 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 overflow-y-auto pt-16 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
                  <button onClick={() => { handleLoadHistory(h); setSidebarOpen(false); }} className="text-left w-full">
                    <p className="text-sm font-medium text-zinc-100 truncate">{h.idea}</p>
                    <p className="text-xs text-zinc-500 mt-1">{new Date(h.createdAt).toLocaleDateString()} · {h.outputs.length} outputs</p>
                  </button>
                  <button onClick={() => { deleteHistoryEntry(h.id); setHistory(getHistory()); }}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <div className="md:pl-72">
        {/* Header */}
        <nav className="sticky top-0 z-30 flex justify-between items-center w-full px-4 py-4 bg-zinc-950 border-b border-zinc-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-zinc-400 hover:text-indigo-400 p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <span className="text-lg font-bold text-zinc-100">Prompt to Market</span>
          {!connected && (
            <button onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
              Connect
            </button>
          )}
        </nav>

        <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
          <section className="text-center mb-10 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4 leading-tight">
              Type a product idea. <br /><span className="text-indigo-400">Get a launch kit.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              Your complete launch kit—landing pages, social posts, and visual assets—generated in seconds by AI.
            </p>
          </section>

          <section id="generate-form" className="mb-10 animate-fade-up [animation-delay:100ms] relative z-10">
            <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-up [animation-delay:200ms] relative z-0">
            {['Landing Pages', 'Social Posts', 'Visual Assets'].map((f) => (
              <span key={f} className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300">{f}</span>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-500">Powered by Pollinations AI · Bring Your Own Pollen</p>
        </main>

        <footer className="border-t border-zinc-800 py-6 px-6">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm font-semibold text-zinc-100">Prompt to Market</span>
            <div className="flex gap-6">
              <a className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors" href="#">Privacy Policy</a>
              <a className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors" href="#">Terms of Service</a>
              <a className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors" href="#">API Docs</a>
            </div>
            <p className="text-xs text-zinc-500">© 2026 Prompt to Market</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
