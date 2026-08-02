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
    <div className="crt min-h-screen bg-[#0A0A0A] text-[#EAEAEA] font-mono flex items-center justify-center px-6">
      <div className="bg-[#121212] border border-[#1E1E1E] p-8 max-w-sm w-full text-center animate-scale-in">
        {status === 'processing' && (
          <>
            <div className="w-10 h-10 border-2 border-hazard/20 border-t-hazard rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#909090]">&gt; CONNECTING TO POLLINATIONS...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-10 h-10 border border-phosphor/40 bg-phosphor/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-phosphor text-lg">✓</span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-phosphor">CONNECTED! REDIRECTING...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-10 h-10 border border-hazard/40 bg-hazard/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-hazard text-lg">✕</span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-hazard">CONNECTION FAILED.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-[11px] uppercase tracking-[0.1em] text-hazard hover:opacity-80 underline font-mono">
              [GO BACK AND TRY MANUALLY]
            </button>
          </>
        )}
      </div>
    </div>
  );
}
