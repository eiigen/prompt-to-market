export const TEXT_PROMPTS: Record<string, (idea: string) => { system: string; user: string }> = {
  positioning: (idea) => ({
    system: `You are a product positioning expert. Given a product idea, write ONE sentence that captures what the product is, who it's for, and the key benefit. Be specific. Avoid buzzwords. Format: "[Product] is a [category] that helps [audience] [benefit] by [mechanism]." Output only the sentence, nothing else.`,
    user: idea,
  }),
  landing: (idea) => ({
    system: `You are a conversion copywriter. Given a product idea, write landing page copy. Output as JSON with these exact keys:
- "headline": Under 10 words. Focus on outcome, not feature.
- "subhead": Under 20 words. Expand on how the headline's promise is delivered.
- "benefits": Array of 3 strings. Each starts with an action verb. Each ends with a specific outcome.
- "cta": 2-5 words. Action-oriented. Not "Sign Up" or "Learn More."
Output only the JSON, no markdown fences.`,
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
    system: `You are a startup advisor. Write a Founder FAQ with 5 questions: "What is it?", "Who is it for?", "How is it different?", "How much does it cost?", "When can I use it?". Output as JSON: { "questions": [{"question": "...", "answer": "..."}, ...] }. No markdown fences.`,
    user: idea,
  }),
};

export const IMAGE_PROMPTS: Record<string, (idea: string) => string> = {
  hero: (idea) => `Professional product photography of ${idea}. Clean white background. Modern minimal style. Studio lighting. High quality. 4k.`,
  logo: (idea) => `Three logo designs for ${idea}. Top: minimal line icon. Middle: bold typographic. Bottom: playful illustrated. White background. Grid layout. Professional branding.`,
  'social-image': (idea) => `Instagram post design for ${idea}. Clean modern aesthetic. Subtle gradient background. Product showcase. High quality.`,
  og: (idea) => `Open graph image for ${idea}. Modern clean design. Professional. Product name and tagline concept.`,
};
