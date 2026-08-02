import { getApiKey, logout } from '../lib/auth';

interface Props {
  hiddenWhenConnected?: boolean;
}

export default function AuthStatus({ hiddenWhenConnected = false }: Props) {
  const key = getApiKey();
  if (hiddenWhenConnected && key) return null;

  if (key) {
    return (
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#909090]">
        <span className="inline-block w-2 h-2 bg-phosphor animate-terminal-blink" />
        [CONNECTED]
        <button onClick={logout} className="text-hazard hover:opacity-80 underline ml-1">[DISCONNECT]</button>
      </div>
    );
  }

  return (
    <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#505050]">
      &gt;&gt; CONNECT POLLINATIONS TO START GENERATING
    </span>
  );
}
