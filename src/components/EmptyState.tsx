import { useNavigate } from 'react-router-dom';

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <h2 className="text-xl font-semibold text-ink-primary mb-2">No launch kit yet</h2>
      <p className="text-ink-secondary text-sm max-w-xs mb-6">Describe your product idea and we’ll generate everything you need to launch.</p>
      <button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-glow-sm hover:-translate-y-0.5 active:translate-y-0">
        Generate New Idea
      </button>
    </div>
  );
}
