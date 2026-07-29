import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GenerateForm from '../components/GenerateForm';
import Sidebar from '../components/Sidebar';
import type { HistoryEntry } from '../lib/history';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar onLoad={handleLoadHistory} />

      {/* TopNavBar — exact Stitch layout */}
      <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-margin py-md max-w-container-max mx-auto bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="w-10" />
        <span className="text-title-lg font-display-md font-bold text-on-surface">Prompt to Market</span>
        <button onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-lg py-sm rounded-lg font-label-md transition-all active:scale-95">
          Get Started
        </button>
      </nav>

      <main className="relative">
        {/* Hero Section — exact Stitch */}
        <section className="relative pt-3xl pb-3xl px-margin overflow-hidden">
          <div className="relative z-10 max-w-container-max mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-xs px-sm py-xs bg-primary-container/10 border border-primary/20 rounded-full mb-lg">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider">AI-Powered Market Execution</span>
            </div>
            <h1 className="font-display-lg text-display-lg md:text-[64px] text-on-surface max-w-4xl mb-md leading-tight">
              Type a product idea. <br />
              <span className="text-primary">Get a launch kit.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-2xl">
              Your complete launch kit—landing pages, ads, and social posts—generated in seconds by AI. Turn concepts into commerce instantly.
            </p>
            <div id="generate-form" className="w-full max-w-3xl glass-card p-sm rounded-xl shadow-2xl">
              <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
            <div className="mt-xl flex items-center gap-lg opacity-60">
              <p className="text-label-sm font-label-sm text-on-surface-variant">Powered by Pollinations AI · Bring Your Own Pollen</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Showcase — exact Stitch */}
        <section className="py-3xl px-margin max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            <div className="md:col-span-8 glass-card rounded-xl p-xl overflow-hidden relative group">
              <div className="relative z-10">
                <span className="text-primary font-label-sm mb-sm block">INTELLIGENT ASSETS</span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-md">High-Conversion Landing Pages</h3>
                <p className="text-body-md text-on-surface-variant max-w-md">Optimized layouts and persuasive copy written by AI that understands your target demographic's pain points.</p>
              </div>
            </div>
            <div className="md:col-span-4 glass-card rounded-xl p-xl flex flex-col justify-between">
              <div>
                <span className="text-tertiary font-label-sm mb-sm block">SOCIAL REACH</span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-md">Ad Campaigns</h3>
                <p className="text-body-md text-on-surface-variant">Ready-to-run copy and creative for Meta, Google, and LinkedIn.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — exact Stitch */}
        <section className="py-3xl px-margin bg-surface-container-low/30">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-2xl">
              <h2 className="font-headline-lg text-[36px] text-on-surface mb-md">Launch in three simple steps</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">From concept to live campaign in under 60 seconds.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {[
                { n: '01', title: 'Describe your product idea', desc: 'Share your vision in a few sentences. Our engine processes the core value prop and target market.' },
                { n: '02', title: 'AI generates your launch kit', desc: 'Our AI builds everything from copy to assets, including legal pages, email sequences, and visual mockups.' },
                { n: '03', title: 'Download and launch', desc: 'Get your kit and go to market instantly. One-click deploy or download the raw source files.' },
              ].map((s) => (
                <div key={s.n} className="relative group">
                  <div className="mb-lg w-16 h-16 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                    <span className="text-headline-md text-primary">{s.n}</span>
                  </div>
                  <h4 className="font-title-lg text-title-lg text-on-surface mb-sm">{s.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — exact Stitch */}
        <section className="py-3xl px-margin">
          <div className="max-w-container-max mx-auto">
            <div className="glass-card rounded-2xl p-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative z-10">
                <h2 className="font-display-md text-display-md text-on-surface mb-lg">Ready to see your idea in action?</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-xl mx-auto">Start building your market presence today with our autonomous launch engine.</p>
                <div className="flex flex-col sm:flex-row gap-md justify-center">
                  <button onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white px-2xl py-lg rounded-lg font-label-md transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                    Create My Kit Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — exact Stitch */}
      <footer className="w-full px-margin py-xl flex flex-col md:flex-row justify-between items-center gap-md max-w-container-max mx-auto border-t border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="text-label-md font-display-md font-bold text-on-surface">Prompt to Market</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant opacity-60">© 2026 Prompt to Market. Autonomous launch execution.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-xl">
          <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy Policy</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms of Service</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
