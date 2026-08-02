import { useNavigate } from 'react-router-dom';

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
      <div className="w-14 h-14 border border-[#1E1E1E] bg-[#0A0A0A] flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="text-hazard-dim">
          <rect x="3" y="3" width="18" height="18" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>
      <h2 className="text-sm font-mono uppercase tracking-[0.15em] text-[#EAEAEA] mb-3">
        <span className="text-hazard-dim">[ </span>NO LAUNCH KIT<span className="text-hazard-dim"> ]</span>
      </h2>
      <p className="text-[#909090] text-[11px] font-mono max-w-xs mb-6 leading-relaxed">
        &gt;&gt; DESCRIBE YOUR PRODUCT IDEA AND WE&apos;LL GENERATE EVERYTHING YOU NEED TO LAUNCH.
      </p>
      <button onClick={() => navigate('/')} className="bg-hazard hover:bg-hazard-dim text-[#EAEAEA] font-mono text-[11px] uppercase tracking-[0.1em] border border-hazard px-5 py-2.5 transition-all duration-200 active:scale-[0.98]">
        &gt; GENERATE NEW IDEA
      </button>
    </div>
  );
}
