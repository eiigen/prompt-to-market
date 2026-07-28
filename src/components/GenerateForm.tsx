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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. AI meal planner for gym bros"
          className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : apiKey ? 'Generate Kit' : 'Connect & Generate'}
        </button>
      </div>
      <div className="mt-3 text-sm text-gray-500">
        {apiKey ? (
          <span>Connected ✓ <button type="button" onClick={logout} className="underline hover:text-gray-300">Disconnect</button></span>
        ) : (
          <span>Connect Pollinations to start generating</span>
        )}
      </div>
    </form>
  );
}
