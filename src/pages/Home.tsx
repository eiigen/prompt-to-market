import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getApiKey } from '../lib/auth';
import GenerateForm from '../components/GenerateForm';
import Sidebar from '../components/Sidebar';
import type { HistoryEntry } from '../lib/history';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const connected = !!getApiKey();

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
      <Sidebar onLoad={handleLoadHistory} />

      <div className="md:flex">
        {/* Sidebar spacer on desktop */}
        <div className="hidden md:block md:w-72 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-zinc-950 border-b border-zinc-800">
            <Sidebar.Trigger />
            <span className="text-lg font-bold text-zinc-100">Prompt to Market</span>
            {!connected && (
              <button
                onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Connect
              </button>
            )}
          </nav>

          <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
            {/* Hero */}
            <section className="text-center mb-10 animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4 leading-tight">
                Type a product idea. <br />
                <span className="text-indigo-400">Get a launch kit.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                Your complete launch kit—landing pages, social posts, and visual assets—generated in seconds by AI.
              </p>
            </section>

            {/* Form */}
            <section id="generate-form" className="mb-10 animate-fade-up [animation-delay:100ms]">
              <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
            </section>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-up [animation-delay:200ms]">
              {['Landing Pages', 'Social Posts', 'Visual Assets'].map((f) => (
                <span key={f} className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300">
                  {f}
                </span>
              ))}
            </div>

            <p className="text-center text-xs text-zinc-500">Powered by Pollinations AI · Bring Your Own Pollen</p>
          </main>

          {/* Footer */}
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
    </div>
  );
}
