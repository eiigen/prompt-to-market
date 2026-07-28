const CLIENT_ID = import.meta.env.VITE_POLLINATIONS_CLIENT_ID || '';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/callback` : '';

export function initiateAuth() {
  if (!CLIENT_ID) {
    const key = prompt('Paste your Pollinations API key (sk_...):');
    if (key) localStorage.setItem('pollinations_api_key', key);
    return;
  }
  const params = new URLSearchParams({ redirect_uri: REDIRECT_URI, client_id: CLIENT_ID });
  window.location.href = `https://gen.pollinations.ai/authorize?${params}`;
}

export function handleCallback(): string | null {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const apiKey = fragment.get('api_key');
  if (apiKey) {
    localStorage.setItem('pollinations_api_key', apiKey);
    window.history.replaceState({}, '', '/callback');
  }
  return apiKey;
}

export function getApiKey(): string | null {
  return localStorage.getItem('pollinations_api_key');
}

export function logout() {
  localStorage.removeItem('pollinations_api_key');
}

export function setApiKey(key: string) {
  localStorage.setItem('pollinations_api_key', key);
}
