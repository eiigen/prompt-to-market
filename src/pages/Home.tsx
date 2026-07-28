import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GenerateForm from '../components/GenerateForm';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = (idea: string) => {
    setIsLoading(true);
    sessionStorage.setItem('product_idea', idea);
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* TopNavBar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-margin py-md max-w-container-max mx-auto bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-sm">
          <span className="text-title-lg font-bold text-on-surface">Prompt to Market</span>
        </div>
        <div className="hidden md:flex items-center gap-xl">
          <a className="text-label-md text-primary border-b-2 border-primary pb-1" href="#">Platform</a>
          <a className="text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Features</a>
          <a className="text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Case Studies</a>
        </div>
        <div className="flex items-center gap-md">
          <button className="hidden sm:block text-label-md text-on-surface-variant hover:text-primary transition-colors">Login</button>
          <button className="bg-[#3B82F6] hover:bg-blue-600 text-white px-lg py-sm rounded-lg text-label-md transition-all active:scale-95">Get Started</button>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-3xl pb-3xl px-margin overflow-hidden">
          <div className="relative z-10 max-w-container-max mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-xs px-sm py-xs bg-primary-container/10 border border-primary/20 rounded-full mb-lg">
              <span className="text-label-sm text-primary uppercase tracking-wider">AI-Powered Market Execution</span>
            </div>
            <h1 className="text-display-lg md:text-[64px] text-on-surface max-w-4xl mb-md leading-tight">
              Type a product idea. <br/>
              <span className="text-primary">Get a launch kit.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mb-2xl">
              Your complete launch kit—landing pages, ads, and social posts—generated in seconds by AI. Turn concepts into commerce instantly.
            </p>
            <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />
            <div className="mt-xl flex items-center gap-lg opacity-60">
              <p className="text-label-sm text-on-surface-variant">Powered by Pollinations AI · Bring Your Own Pollen</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-3xl px-margin bg-surface-container-low/30">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-2xl">
              <h2 className="text-headline-lg text-[36px] text-on-surface mb-md">Launch in three simple steps</h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">From concept to live campaign in under 60 seconds.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              {[
                { n: '01', title: 'Describe your product idea', desc: 'Share your vision in a few sentences. Our engine processes the core value prop and target market.' },
                { n: '02', title: 'AI generates your launch kit', desc: 'Our AI builds everything from copy to assets, including landing pages, social posts, and visual mockups.' },
                { n: '03', title: 'Download and launch', desc: 'Get your kit and go to market instantly. Copy, download, or regenerate anything.' },
              ].map((s) => (
                <div key={s.n} className="relative group">
                  <div className="mb-lg w-16 h-16 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                    <span className="text-headline-md text-primary">{s.n}</span>
                  </div>
                  <h4 className="text-title-lg text-on-surface mb-sm">{s.title}</h4>
                  <p className="text-body-md text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-3xl px-margin">
          <div className="max-w-container-max mx-auto">
            <div className="glass-card rounded-2xl p-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              <div className="relative z-10">
                <h2 className="text-display-md text-on-surface mb-lg">Ready to see your idea in action?</h2>
                <p className="text-body-lg text-on-surface-variant mb-xl max-w-xl mx-auto">Start building your market presence today with our autonomous launch engine.</p>
                <button className="bg-[#3B82F6] hover:bg-blue-600 text-white px-2xl py-lg rounded-lg text-label-md transition-all active:scale-95 shadow-lg shadow-blue-500/20">Create My Kit Now</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-margin py-xl flex flex-col md:flex-row justify-between items-center gap-md max-w-container-max mx-auto border-t border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="text-label-md font-bold text-on-surface">Prompt to Market</span>
          <p className="text-label-sm text-on-surface-variant opacity-60">© 2026 Prompt to Market. Autonomous launch execution.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-xl">
          <a className="text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy Policy</a>
          <a className="text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms of Service</a>
          <a className="text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
