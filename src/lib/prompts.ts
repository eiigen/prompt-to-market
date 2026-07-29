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
Output only the caption text.`,
    user: idea,
  }),
  twitter: (idea) => ({
    system: `You are a Twitter growth strategist. Write ONE tweet about this product. Under 280 characters. One clear benefit. No hashtags. Ends with a hook that invites replies. Output only the tweet text.`,
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

Questions: What is it? Who is it for? How is it different? How much does it cost? When can I use it?
Output only the Q&A, no extra text.`,
    user: idea,
  }),
};

// Image prompt enhancer — generates visual scene descriptions, not product concepts
export const IMAGE_ENHANCER_PROMPTS: Record<string, string> = {
  hero: `You write image prompts for Flux AI. Given a product idea, describe a PHOTOGRAPHIC SCENE that visually represents the idea. Describe ONLY what would be visible in a photograph: objects, people, setting, lighting, colors, composition, camera angle. Do NOT use words like "app", "AI", "digital", "interface", "concept", "mockup". Instead describe a real-world scene. Example: "Gym meal prep: open food containers on a wooden table, dumbbells in background, morning sunlight streaming through window, fresh vegetables, clean aesthetic, shallow depth of field, 85mm lens." Output only the scene description, 30-50 words.`,

  logo: `You write image prompts for Flux AI. Given a product idea, describe THREE LOGO VARIATIONS in a grid. Describe ONLY the visual elements: shapes, icons, typography, colors, layout. Example: "Three logo designs: top - minimalist circular icon with abstract leaf shape, thin line art; middle - bold geometric sans-serif typeface, dark navy text; bottom - playful illustrated character, rounded shapes, warm orange. White background, grid layout." Output only the description, 30-50 words.`,

  'social-image': `You write image prompts for Flux AI. Given a product idea, describe a VIBRANT INSTAGRAM POST. Describe ONLY what is visible: background, colors, composition, text placement, mood. Example: "Square format: bold teal and coral gradient background, centered white product packaging, large sans-serif headline text, subtle shadow depth, clean modern layout, bright natural lighting, high contrast, social media aesthetic." Output only the description, 30-50 words.`,

  og: `You write image prompts for Flux AI. Given a product idea, describe a WIDE FORMAT SHARING IMAGE (1200x630). Describe ONLY what is visible: background, colors, composition, text space. Example: "Wide format: deep navy gradient background, subtle dotted grid pattern, centered geometric icon, negative space on left for text overlay, clean minimal layout, professional corporate aesthetic, soft glow effect." Output only the description, 30-50 words.`,
};

export const IMAGE_PROMPTS: Record<string, (idea: string) => string> = {
  hero: (idea) => `Real-world scene representing ${idea}. Clean professional photography, natural lighting, shallow depth of field, warm tones, 85mm lens, cinematic composition.`,
  logo: (idea) => `Three logo variations for ${idea} brand. Minimal line icon, bold typographic, playful illustrated. White background, grid layout, professional branding.`,
  'social-image': (idea) => `Vibrant Instagram post for ${idea}. Bold gradient background, centered product, large text overlay, high contrast, scroll-stopping composition.`,
  og: (idea) => `Wide sharing image for ${idea}. Dark navy gradient, subtle grid pattern, centered icon, space for text, professional clean layout.`,
};

export interface ModelInfo {
  name: string;
  title: string;
  description: string;
  category: 'text' | 'image';
}

let cachedModels: { text: ModelInfo[]; image: ModelInfo[] } | null = null;

export async function fetchModels(): Promise<{ text: ModelInfo[]; image: ModelInfo[] }> {
  if (cachedModels) return cachedModels;
  try {
    const res = await fetch('https://gen.pollinations.ai/models');
    const data = await res.json();
    const text = data.filter((m: any) => m.category === 'text').map((m: any) => ({ name: m.name, title: m.title || m.name, description: m.description || '', category: 'text' as const }));
    const image = data.filter((m: any) => m.category === 'image').map((m: any) => ({ name: m.name, title: m.title || m.name, description: m.description || '', category: 'image' as const }));
    cachedModels = { text, image };
    return cachedModels;
  } catch {
    return { text: [{ name: 'openai', title: 'GPT (default)', description: '', category: 'text' }], image: [{ name: 'flux', title: 'Flux (default)', description: '', category: 'image' }] };
  }
}
