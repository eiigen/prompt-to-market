# 🚀 Prompt to Market

**Type a product idea. Get a launch kit.**

Your complete marketing kit — landing page copy, social posts, hero image, logo, and more — generated in 60 seconds by AI.

**[→ Try it live](https://eiigen.github.io/prompt-to-market/)**

---

## What you get

| Output | What it is |
|--------|------------|
| Positioning Statement | One sentence that captures your product, audience, and benefit |
| Landing Page Copy | Headline, subhead, 3 benefit bullets, CTA button text |
| Instagram Caption | Hook + body + hashtags, ready to post |
| Twitter/X Post | Under 280 chars, optimized for engagement |
| LinkedIn Post | Professional hook + story + CTA, 150-300 words |
| Founder FAQ | 5 questions your users will ask, answered |
| Hero Image | 1200×630 product concept visual |
| Logo Variations | 3 styles: minimal, bold, playful |
| Social Post Image | 1080×1080 Instagram-ready visual |
| OG Image | 1200×630 link preview image |

**10 outputs. One input. Zero cost to you.**

---

## How it works

1. **Connect Pollinations** — one click, uses BYOP (Bring Your Own Pollen). You pay nothing to the developer.
2. **Type your idea** — "AI meal planner for gym bros" is all you need.
3. **Get your kit** — all 10 outputs generated in parallel. Copy, download, or regenerate anything.

---

## Built with

- **Pollinations AI** — text and image generation ([API docs](https://gen.pollinations.ai/docs))
- **BYOP** — users bring their own Pollen balance. Developer pays $0.
- **Vite + React + TypeScript** — fast, type-safe, no bloat
- **Tailwind CSS** — utility-first styling
- **Stitch** — UI design by Google

---

## For developers

This is a fully client-side app. No backend, no database, no server costs.

```
git clone https://github.com/eiigen/prompt-to-market.git
cd prompt-to-market
npm install
npm run dev
```

### API endpoints used

| Endpoint | Purpose |
|----------|---------|
| `POST https://gen.pollinations.ai/v1/chat/completions` | Text generation (OpenAI-compatible) |
| `GET https://gen.pollinations.ai/image/{prompt}` | Image generation |
| `https://enter.pollinations.ai/authorize` | BYOP OAuth flow |

### Project structure

```
src/
├── lib/
│   ├── auth.ts           # BYOP auth flow
│   ├── pollinations.ts   # API client
│   ├── prompts.ts        # System prompts for each output
│   └── types.ts          # Shared types
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── Results.tsx        # Launch kit display
│   └── Callback.tsx       # OAuth callback
└── components/
    ├── GenerateForm.tsx   # Input form
    ├── TextOutput.tsx     # Text output with copy/edit/regen
    ├── ImageOutput.tsx    # Image output with download/regen
    └── DownloadAll.tsx    # Zip download
```

---

## Why this exists

Every indie hacker has ideas. Few have time to write landing pages, design logos, and craft social posts for each one. Prompt to Market turns one sentence into a complete launch kit — so you can validate ideas in seconds, not days.

---

## License

MIT

---

**[→ Try Prompt to Market](https://eiigen.github.io/prompt-to-market/)** · Built on [Pollinations AI](https://pollinations.ai)
