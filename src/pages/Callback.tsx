import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallback } from '../lib/auth';

export default function Callback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const key = handleCallback();
    if (key) {
      setStatus('success');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setStatus('error');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-6">
      <div className="bg-surface-elevated border border-surface-border rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
        {status === 'processing' && (
          <>
            <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-ink-primary">Connecting to Pollinations...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <p className="text-lg text-emerald-400">Connected! Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-lg">✕</span>
            </div>
            <p className="text-lg text-red-400">Connection failed.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-orange-400 hover:text-orange-300 underline">
              Go back and try manually
            </button>
          </>
        )}
      </div>
    </div>
  );
}
