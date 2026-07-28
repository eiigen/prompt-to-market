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
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center">
      <div className="glass-card rounded-2xl p-2xl text-center max-w-md">
        {status === 'processing' && <p className="text-body-lg text-on-surface-variant">Connecting to Pollinations...</p>}
        {status === 'success' && <p className="text-body-lg text-primary">Connected! Redirecting...</p>}
        {status === 'error' && (
          <div>
            <p className="text-body-lg text-error">Connection failed.</p>
            <button onClick={() => navigate('/')} className="mt-lg text-primary underline">Go back</button>
          </div>
        )}
      </div>
    </div>
  );
}
