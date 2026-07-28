const CLIENT_ID = import.meta.env.VITE_POLLINATIONS_CLIENT_ID || 'pk_fJFepOdA7LMOZ1LA';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/prompt-to-market/` : '';

export function initiateAuth() {
  const params = new URLSearchParams({
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
  });
  window.location.href = `https://gen.pollinations.ai/authorize?${params}`;
}

export function handleCallback(): string | null {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const apiKey = fragment.get('api_key');
  if (apiKey) {
    localStorage.setItem('pollinations_api_key', apiKey);
    window.history.replaceState({}, '', window.location.pathname);
  }
  return apiKey;
}

export function getApiKey(): string | null {
  return localStorage.getItem('pollinations_api_key');
}

export function logout() {
  localStorage.removeItem('pollinations_api_key');
}
