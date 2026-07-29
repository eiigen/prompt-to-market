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
  hero: `You are a professional product photographer. Given a product idea, write ONE detailed image prompt for generating a hero/landing page image. The image should show the product concept in use, clean professional aesthetic, suitable for a SaaS landing page. Include: subject, setting, lighting, style, mood, color palette. Output only the prompt, 30-50 words.`,
  logo: `You are a professional brand designer. Given a product idea, write ONE detailed image prompt for generating logo variations. The image should show 3 logo styles: minimal line icon, bold typographic, playful illustrated. Include: layout (grid), background color, style descriptions. Output only the prompt, 30-50 words.`,
  'social-image': `You are a social media graphic designer. Given a product idea, write ONE detailed image prompt for generating an Instagram post image. The image should be square, visually striking, with product concept and brand elements. Include: style, mood, colors, composition. Output only the prompt, 30-50 words.`,
  og: `You are a marketing designer. Given a product idea, write ONE detailed image prompt for generating an Open Graph image (1200x630). The image should be wide-format, professional, with space for text overlay. Include: style, mood, colors, composition. Output only the prompt, 30-50 words.`,
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
