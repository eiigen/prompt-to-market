export const TEXT_PROMPTS: Record<string, (idea: string) => { system: string; user: string }> = {
  positioning: (idea) => ({
    system: `You are a product positioning expert. Given a product idea, write ONE sentence that captures what the product is, who it's for, and the key benefit. Be specific. Avoid buzzwords. Output only the sentence, nothing else.`,
    user: idea,
  }),
  landing: (idea) => ({
    system: `You are a conversion copywriter. Given a product idea, write landing page copy. Output formatted text with this structure:

Headline: [under 10 words, focus on outcome]

Subheadline: [under 20 words, expand on the promise]

Benefits:
- [action verb]... [specific outcome]
- [action verb]... [specific outcome]
- [action verb]... [specific outcome]

CTA: [2-5 words, action-oriented]

Output only the copy, no explanations.`,
    user: idea,
  }),
  instagram: (idea) => ({
    system: `You are an Instagram content strategist. Write ONE Instagram caption for this product. Rules:
- Hook (first line): Stops the scroll. Max 125 chars.
- Body: 3-5 short paragraphs with line breaks.
- CTA: Tell them what to do next.
- Hashtags: 5-10 relevant at end. Mix broad + niche.
- Emojis: 2-3, sparingly.
- No "Hey guys!" or "Hope you're having a great day!"
Output only the caption text.`,
    user: idea,
  }),
  twitter: (idea) => ({
    system: `You are a Twitter growth strategist. Write ONE tweet about this product. Under 280 characters. One clear benefit. No hashtags. Ends with a hook that invites replies. Simple direct language. Output only the tweet text.`,
    user: idea,
  }),
  linkedin: (idea) => ({
    system: `You are a LinkedIn content creator. Write ONE LinkedIn post about this product. Hook (first line), 3-5 short paragraphs, CTA question. Professional but human. 150-300 words. No emojis in first line. Output only the post text.`,
    user: idea,
  }),
  faq: (idea) => ({
    system: `You are a startup advisor. Given a product idea, write a Founder FAQ with 5 questions and answers. Format as:

Q: [question]
A: [answer — 1-2 sentences, specific and honest]

Questions to cover:
1. What is it?
2. Who is it for?
3. How is it different from alternatives?
4. How much does it cost?
5. When can I use it?

If pricing isn't decided, say "Pricing TBD — join waitlist for early access." If no timeline, say "Building in public — follow for updates."
Output only the Q&A, no extra text.`,
    user: idea,
  }),
};

export const IMAGE_PROMPTS: Record<string, (idea: string) => string> = {
  hero: (idea) => `Professional product photography of ${idea}. Clean white background. Modern minimal style. Studio lighting. High quality. 4k.`,
  logo: (idea) => `Three logo designs for ${idea}. Top: minimal line icon. Middle: bold typographic. Bottom: playful illustrated. White background. Grid layout. Professional branding.`,
  'social-image': (idea) => `Instagram post design for ${idea}. Clean modern aesthetic. Subtle gradient background. Product showcase. High quality.`,
  og: (idea) => `Open graph image for ${idea}. Modern clean design. Professional. Product name and tagline concept.`,
};

export const TEXT_MODELS = [
  { value: 'openai', label: 'GPT (default)' },
  { value: 'openai-fast', label: 'GPT Fast' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'gemini-fast', label: 'Gemini Fast' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'grok', label: 'Grok' },
  { value: 'claude', label: 'Claude' },
  { value: 'llama', label: 'Llama' },
];

export const IMAGE_MODELS = [
  { value: 'flux', label: 'Flux (default)' },
  { value: 'gptimage', label: 'GPT Image' },
  { value: 'turbo', label: 'Turbo' },
  { value: 'flux-realism', label: 'Flux Realism' },
  { value: 'flux-anime', label: 'Flux Anime' },
  { value: 'flux-3d', label: 'Flux 3D' },
];
