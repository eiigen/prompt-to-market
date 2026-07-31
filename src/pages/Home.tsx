import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type HistoryEntry } from '../lib/history';
import GenerateForm from '../components/GenerateForm';
import Sidebar from '../components/Sidebar';
import AuthStatus from '../components/AuthStatus';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary flex">
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 md:hidden" />
      )}

      <div className="hidden md:block w-72 flex-shrink-0">
        <Sidebar onLoad={handleLoadHistory} className="fixed top-0 left-0 w-72 h-screen" />
      </div>

      <div className={`fixed top-0 left-0 z-50 h-full transform transition-transform duration-200 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onLoad={(e) => { handleLoadHistory(e); setSidebarOpen(false); }} className="w-72 pt-14" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <nav className="sticky top-0 z-30 flex justify-between items-center w-full px-4 py-4 bg-surface-base/90 backdrop-blur border-b border-surface-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-ink-secondary hover:text-orange-400 p-1.5 rounded-md hover:bg-surface-elevated transition-colors"
            aria-label="Toggle history sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <span className="text-lg font-bold text-ink-primary">Prompt to Market</span>
          <AuthStatus hiddenWhenConnected />
        </nav>

        <main className="flex-1 relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_50%)]" />

          <div className="relative max-w-2xl mx-auto px-6 pt-20 pb-24">
            <section className="text-center mb-10 animate-fade-up">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 mb-4 animate-fade-up" style={{ animationDelay: '0ms' }}>
                AI-Powered Launch Kit
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold text-ink-primary mb-5 leading-[1.1] tracking-tight animate-fade-up" style={{ animationDelay: '80ms' }}>
                Type a product idea.<br />
                <span className="text-orange-500">Get a launch kit.</span>
              </h1>
              <p className="text-lg md:text-xl text-ink-secondary max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '160ms' }}>
                Landing pages, social posts, and visual assets — generated in seconds by Pollinations AI.
              </p>
            </section>

            <section id="generate-form" className="mb-10 animate-fade-up relative z-10" style={{ animationDelay: '240ms' }}>
              <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
            </section>

            <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-up" style={{ animationDelay: '320ms' }}>
              {['Landing Pages', 'Social Posts', 'Visual Assets'].map((f) => (
                <span
                  key={f}
                  className="bg-transparent border border-surface-border rounded-full px-4 py-2 text-sm text-ink-secondary transition-colors hover:border-orange-500/60 hover:text-ink-primary"
                >
                  {f}
                </span>
              ))}
            </div>

            <p className="text-center text-xs text-ink-muted animate-fade-up" style={{ animationDelay: '400ms' }}>
              Powered by Pollinations AI · Bring Your Own Pollen
            </p>
          </div>
        </main>

        <footer className="border-t border-surface-border py-6 px-6 bg-surface-sunken">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm font-semibold text-ink-primary">Prompt to Market</span>
            <div className="flex gap-6">
              <a className="text-xs text-ink-muted hover:text-orange-400 transition-colors" href="#">Privacy Policy</a>
              <a className="text-xs text-ink-muted hover:text-orange-400 transition-colors" href="#">Terms of Service</a>
              <a className="text-xs text-ink-muted hover:text-orange-400 transition-colors" href="#">API Docs</a>
            </div>
            <p className="text-xs text-ink-muted">© 2026 Prompt to Market</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
