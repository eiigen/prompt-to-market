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
    <div className="crt min-h-screen bg-[#0A0A0A] text-[#EAEAEA] font-mono flex">
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
        <nav className="sticky top-0 z-30 flex justify-between items-center w-full px-4 py-3 bg-[#0A0A0A] border-b border-[#1E1E1E]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-[#909090] hover:text-hazard p-1.5 transition-colors"
            aria-label="Toggle history sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <span className="text-sm uppercase tracking-[0.15em] text-[#EAEAEA]"><span className="text-hazard-dim">[ </span>PROMPT TO MARKET<span className="text-hazard-dim"> ]</span></span>
          <AuthStatus hiddenWhenConnected />
        </nav>

        <main className="flex-1 relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(230,25,25,0.06),transparent_50%)]" />

          <div className="relative max-w-2xl mx-auto px-6 pt-16 pb-24">
            <section className="mb-10 animate-crt-on">
              <p className="text-xs font-mono uppercase tracking-[0.15em] text-hazard mb-4 animate-data-fade">
                <span className="text-hazard-dim">[</span> SYSTEM <span className="text-hazard-dim">]</span> AI-Powered Launch Kit
              </p>
              <h1 className="text-4xl md:text-6xl font-mono uppercase tracking-[-0.03em] leading-[0.9] text-[#EAEAEA] mb-5 animate-scan-reveal" style={{ animationDelay: '80ms' }}>
                TYPE A PRODUCT<br />
                <span className="text-hazard">GET A LAUNCH KIT</span>
              </h1>
              <p className="text-sm md:text-base font-mono text-[#909090] max-w-xl leading-relaxed animate-data-fade" style={{ animationDelay: '160ms' }}>
                <span className="text-hazard-dim">&gt;&gt;&gt;</span> Landing pages, social posts, and visual assets<br />
                <span className="text-hazard-dim">&gt;&gt;&gt;</span> Generated in seconds by Pollinations AI
              </p>
            </section>

            <section id="generate-form" className="mb-8 border border-[#1E1E1E] p-6 animate-data-fade relative z-10" style={{ animationDelay: '240ms' }}>
              <div className="text-[10px] uppercase tracking-[0.2em] text-hazard-dim mb-4">[ INPUT ]</div>
              <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
            </section>

            <div className="flex flex-wrap gap-2 mb-14 animate-data-fade" style={{ animationDelay: '320ms' }}>
              {['Landing Pages', 'Social Posts', 'Visual Assets'].map((f) => (
                <span key={f} className="font-mono text-[11px] uppercase tracking-[0.1em] border border-[#1E1E1E] px-3 py-1.5 text-[#909090] hover:border-hazard hover:text-hazard transition-colors">
                  {f}
                </span>
              ))}
            </div>

            <p className="text-center text-[10px] font-mono uppercase tracking-[0.15em] text-[#505050] animate-data-fade" style={{ animationDelay: '400ms' }}>
              <span className="text-hazard-dim">[</span> POWERED BY POLLINATIONS AI · BRING YOUR OWN POLLEN <span className="text-hazard-dim">]</span>
            </p>
          </div>
        </main>

        <footer className="border-t border-[#1E1E1E] py-5 px-6 bg-[#050505]">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#EAEAEA]">[ PROMPT TO MARKET ]</span>
            <div className="flex gap-5">
              <a className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#505050] hover:text-hazard transition-colors" href="#">Privacy Policy</a>
              <a className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#505050] hover:text-hazard transition-colors" href="#">Terms of Service</a>
              <a className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#505050] hover:text-hazard transition-colors" href="https://gen.pollinations.ai/docs">API Docs</a>
            </div>
            <p className="text-[10px] font-mono text-[#505050]">© 2026 PROMPT TO MARKET</p>
          </div>
        </footer>
      </div>
    </div>
  );
}