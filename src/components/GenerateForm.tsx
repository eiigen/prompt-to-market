import { useState } from 'react';
import { getApiKey, initiateAuth, logout } from '../lib/auth';

interface Props {
  onGenerate: (idea: string) => void;
  isLoading: boolean;
}

export default function GenerateForm({ onGenerate, isLoading }: Props) {
  const [idea, setIdea] = useState('');
  const apiKey = getApiKey();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    if (!apiKey) { initiateAuth(); return; }
    onGenerate(idea.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="glass-card p-sm rounded-xl shadow-2xl flex flex-col md:flex-row gap-sm">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your product idea (e.g., A subscription box for plant lovers)..."
            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary text-on-surface py-lg pl-md pr-md rounded-lg text-body-md placeholder:text-outline"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-2xl py-lg rounded-lg text-label-md transition-all flex items-center justify-center gap-sm group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : apiKey ? 'Generate Launch Kit' : 'Connect & Generate'}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
      <div className="mt-md text-sm text-on-surface-variant">
        {apiKey ? (
          <span>Connected ✓ <button type="button" onClick={logout} className="underline hover:text-primary">Disconnect</button></span>
        ) : (
          <span>Connect Pollinations to start generating</span>
        )}
      </div>
    </form>
  );
}
