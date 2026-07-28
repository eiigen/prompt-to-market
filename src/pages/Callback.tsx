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
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && <p className="text-lg text-gray-400">Connecting to Pollinations...</p>}
        {status === 'success' && <p className="text-lg text-green-400">Connected! Redirecting...</p>}
        {status === 'error' && (
          <div>
            <p className="text-lg text-red-400">Connection failed.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-blue-400 underline">Go back</button>
          </div>
        )}
      </div>
    </div>
  );
}
