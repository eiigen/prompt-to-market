const BASE_URL = 'https://gen.pollinations.ai';

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  model = 'openai',
  timeoutMs = 90000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Session expired. Reconnect Pollinations.');
      if (res.status === 402) throw new Error('Out of Pollen. Top up at enter.pollinations.ai');
      if (res.status === 429) throw new Error('Rate limited. Wait a few minutes.');
      throw new Error(err.error?.message || `API error ${res.status}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Try again.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function getImageUrl(prompt: string, width: number, height: number, model = 'flux', apiKey = ''): string {
  const encoded = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    model,
    width: String(width),
    height: String(height),
    nologo: 'true',
    seed: String(Math.floor(Math.random() * 100000)),
  });
  if (apiKey) params.set('key', apiKey);
  return `${BASE_URL}/image/${encoded}?${params.toString()}`;
}