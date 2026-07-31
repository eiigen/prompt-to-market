import { getApiKey, logout } from '../lib/auth';

interface Props {
  hiddenWhenConnected?: boolean;
}

export default function AuthStatus({ hiddenWhenConnected = false }: Props) {
  const key = getApiKey();
  if (hiddenWhenConnected && key) return null;

  if (key) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-secondary">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Connected
        <button onClick={logout} className="text-orange-400 hover:text-orange-300 underline ml-1">Disconnect</button>
      </div>
    );
  }

  return (
    <span className="text-sm text-ink-secondary">Connect Pollinations to start generating</span>
  );
}
