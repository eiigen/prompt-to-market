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

// Image prompt enhancer — generates detailed, specific prompts per image type
export const IMAGE_ENHANCER_PROMPTS: Record<string, string> = {
  hero: `You are a prompt engineer for AI image generation. Given a product idea, write ONE image prompt for a hero/landing page image. The image must: show the product in a real-world context, be photorealistic, have dramatic lighting, be 1200x630 landscape format. Include: specific scene, lighting details, mood, color palette, camera angle, and lens style. Example format: "A sleek [product] on a marble desk, soft window light from the left, warm amber tones, shallow depth of field, shot on 85mm f/1.4, cinematic mood." Output only the prompt, 40-60 words.`,
  logo: `You are a prompt engineer for AI image generation. Given a product idea, write ONE image prompt for a logo/brand mark image. The image must: show 3 logo variations in a grid layout (minimal line icon, bold typographic, playful illustrated), white background, centered, clean professional branding. Include: layout description, style of each variation, colors. Example format: "Three logo designs for [brand]: top - minimal line icon of a [shape], middle - bold sans-serif typography, bottom - playful illustrated mascot. White background, grid layout, professional branding." Output only the prompt, 40-60 words.`,
  'social-image': `You are a prompt engineer for AI image generation. Given a product idea, write ONE image prompt for an Instagram square post image. The image must: be 1080x1080 square, have a bold visual hook, be scroll-stopping, include product concept prominently. Include: composition, colors, typography style, mood, visual hierarchy. Example format: "Bold Instagram post for [product]: vibrant gradient background, large centered product mockup, white sans-serif text overlay, neon accents, high contrast, scroll-stopping composition." Output only the prompt, 40-60 words.`,
  og: `You are a prompt engineer for AI image generation. Given a product idea, write ONE image prompt for an Open Graph image (1200x630). The image must: be wide-format, have space for text overlay, look professional when shared on social media, have clean composition. Include: layout, colors, mood, where text would go. Example format: "Wide OG image for [product]: dark navy background, subtle grid pattern, centered product visualization, space for text on the left, clean professional layout, minimal design." Output only the prompt, 40-60 words.`,
};

export const IMAGE_PROMPTS: Record<string, (idea: string) => string> = {
  hero: (idea) => `Professional product photography of ${idea}. Clean white background. Modern minimal style. Studio lighting. High quality. 4k.`,
  logo: (idea) => `Three logo designs for ${idea}. Top: minimal line icon. Middle: bold typographic. Bottom: playful illustrated. White background. Grid layout. Professional branding.`,
  'social-image': (idea) => `Instagram post design for ${idea}. Clean modern aesthetic. Subtle gradient background. Product showcase. High quality.`,
  og: (idea) => `Open graph image for ${idea}. Modern clean design. Professional. Product name and tagline concept.`,
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
