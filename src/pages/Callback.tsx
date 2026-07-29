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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-md p-8 text-center max-w-md">
        {status === 'processing' && <p className="text-zinc-400">Connecting to Pollinations...</p>}
        {status === 'success' && <p className="text-emerald-400">Connected! Redirecting...</p>}
        {status === 'error' && (
          <div>
            <p className="text-rose-400">Connection failed.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-indigo-400 hover:text-indigo-300 underline">Go back</button>
          </div>
        )}
      </div>
    </div>
  );
}
