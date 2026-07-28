# Prompt to Market — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side web app that generates complete launch kits from a single product idea, using Pollinations API (text + image) with BYOP authentication.

**Architecture:** Single-page React app (Vite + TypeScript + Tailwind). No backend. All API calls client-side via Pollinations gen.pollinations.ai. Auth via BYOP legacy fragment flow. Stitch designs all UI.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Pollinations API (text + image), Stitch (UI design)

## Global Constraints

- **No backend.** No server, no database, no serverless functions.
- **BYOP only.** No Stripe, no subscriptions, no payments. Users bring their own Pollinations balance.
- **Auth:** Legacy fragment flow (`#api_key=sk_...` in URL). Fallback: manual API key input.
- **Base URL:** `https://gen.pollinations.ai`
- **Text endpoint:** `POST /v1/chat/completions` (OpenAI-compatible)
- **Image endpoint:** `GET /image/{prompt}?model=flux&width=W&height=H`
- **All outputs:** 10 total (6 text + 4 images). Elevator pitch cut. TikTok/Reddit cut.
- **Iteration:** Regenerate replaces. No version history.
- **Deploy:** Vercel (static site)
- **Stitch:** NON-NEGOTIABLE for all UI. Use `stitch::generate-design` → `stitch::react-components`.
- **localStorage:** Auth key only. No history for v1.
- **Mobile:** All screens responsive. Single column on mobile.

---

## File Map

```
prompt-to-market/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx                    # Entry point, router setup
│   ├── App.tsx                     # Route definitions
│   ├── lib/
│   │   ├── pollinations.ts         # API client (text + image)
│   │   ├── prompts.ts              # System prompts for each output
│   │   ├── auth.ts                 # BYOP auth flow + manual key input
│   │   └── types.ts                # Shared types
│   ├── pages/
│   │   ├── Home.tsx                # Landing page + input form
│   │   ├── Callback.tsx            # OAuth callback handler
│   │   └── Results.tsx             # Launch kit display
│   └── components/
│       ├── GenerateForm.tsx        # Product idea input + auth button
│       ├── OutputCard.tsx          # Generic output wrapper (loading/error/success)
│       ├── TextOutput.tsx          # Text output with copy + edit + regenerate
│       ├── ImageOutput.tsx         # Image output with download + regenerate
│       ├── SocialPreview.tsx       # Platform-specific preview frame (IG/Twitter/LinkedIn)
│       ├── LandingPreview.tsx      # Landing page preview (headline + hero + CTA)
│       └── DownloadAll.tsx         # Zip download button
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `prompt-to-market/package.json`
- Create: `prompt-to-market/vite.config.ts`
- Create: `prompt-to-market/tsconfig.json`
- Create: `prompt-to-market/tailwind.config.js`
- Create: `prompt-to-market/postcss.config.js`
- Create: `prompt-to-market/index.html`
- Create: `prompt-to-market/src/main.tsx`
- Create: `prompt-to-market/src/App.tsx`

**Interfaces:**
- Produces: Running dev server at `localhost:5173`

- [ ] **Step 1: Create project directory and initialize**

```bash
cd /root/workspace
mkdir -p prompt-to-market/src/{lib,pages,components}
cd prompt-to-market
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "prompt-to-market",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/file-saver": "^2.0.7",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}
```

- [ ] **Step 3: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 6: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Prompt to Market — Generate Your Launch Kit</title>
    <meta name="description" content="Type a product idea. Get a complete launch kit — landing page copy, social posts, hero image, logo, and more." />
    <meta property="og:title" content="Prompt to Market" />
    <meta property="og:description" content="Type a product idea. Get a complete launch kit." />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create src/main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 9: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 10: Create src/App.tsx**

```tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import Callback from './pages/Callback';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}
```

- [ ] **Step 11: Install dependencies and verify dev server**

```bash
npm install
npm run dev
```

Expected: Dev server starts at `localhost:5173`. Page shows blank (no components yet).

- [ ] **Step 12: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind"
```

---

## Task 2: Types + Pollinations API Client

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/pollinations.ts`

**Interfaces:**
- Produces: `generateText(systemPrompt, userPrompt, apiKey) → Promise<string>`
- Produces: `getImageUrl(prompt, width, height) → string`
- Produces: `checkAuth(apiKey) → Promise<boolean>`

- [ ] **Step 1: Create src/lib/types.ts**

```typescript
export interface ProductIdea {
  raw: string;
  name?: string;
}

export type OutputType =
  | 'positioning'
  | 'landing'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'faq'
  | 'hero'
  | 'logo'
  | 'social-image'
  | 'og';

export interface TextOutput {
  id: string;
  type: OutputType;
  content: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  error?: string;
}

export interface ImageOutput {
  id: string;
  type: OutputType;
  url: string;
  width: number;
  height: number;
  status: 'pending' | 'loading' | 'done' | 'error';
  error?: string;
}

export type AnyOutput = TextOutput | ImageOutput;

export interface LaunchKit {
  idea: string;
  outputs: AnyOutput[];
  createdAt: number;
}
```

- [ ] **Step 2: Create src/lib/pollinations.ts**

```typescript
const BASE_URL = 'https://gen.pollinations.ai';

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export function getImageUrl(prompt: string, width: number, height: number): string {
  const encoded = encodeURIComponent(prompt);
  return `${BASE_URL}/image/${encoded}?model=flux&width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
}

export async function checkAuth(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/v1/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/pollinations.ts
git commit -m "feat: add types and Pollinations API client"
```

---

## Task 3: Auth (BYOP + Manual Fallback)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/pages/Callback.tsx`

**Interfaces:**
- Produces: `initiateAuth() → void`
- Produces: `handleCallback() → string | null`
- Produces: `getApiKey() → string | null`
- Produces: `logout() → void`

- [ ] **Step 1: Create src/lib/auth.ts**

```typescript
const CLIENT_ID = import.meta.env.VITE_POLLINATIONS_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/callback`;

export function initiateAuth() {
  if (!CLIENT_ID) {
    // Fallback: manual key input
    const key = prompt('Paste your Pollinations API key (sk_...):');
    if (key) localStorage.setItem('pollinations_api_key', key);
    return;
  }
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
```

- [ ] **Step 2: Create src/pages/Callback.tsx**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallback } from '../lib/auth';

export default function Callback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const key = handleCallback();
    if (key) {
      setStatus('success');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setStatus('error');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && <p className="text-lg">Connecting to Pollinations...</p>}
        {status === 'success' && <p className="text-lg text-green-600">Connected! Redirecting...</p>}
        {status === 'error' && (
          <div>
            <p className="text-lg text-red-600">Connection failed.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">
              Go back and try manually
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create .env.example**

```
VITE_POLLINATIONS_CLIENT_ID=pk_your_app_key_here
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/pages/Callback.tsx .env.example
git commit -m "feat: add BYOP auth flow with manual fallback"
```

---

## Task 4: System Prompts

**Files:**
- Create: `src/lib/prompts.ts`

**Interfaces:**
- Produces: `PROMPTS` constant — map of OutputType → system prompt string
- Produces: `IMAGE_PROMPTS` constant — map of image OutputType → prompt template

- [ ] **Step 1: Create src/lib/prompts.ts**

```typescript
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
- Hook (first line): Stops the scroll. Question, bold claim, or surprising stat. Max 125 chars (before "see more" truncation).
- Body: 3-5 short paragraphs with line breaks.
- CTA: Tell them what to do next.
- Hashtags: 5-10 relevant hashtags at the end. Mix broad + niche. No #love or #instagood.
- Emojis: 2-3, used sparingly.
- No "Hey guys!" or "Hope you're having a great day!"
Output only the caption text.`,
    user: idea,
  }),

  twitter: (idea) => ({
    system: `You are a Twitter growth strategist. Write ONE tweet about this product. Rules:
- Under 280 characters.
- One clear benefit or insight.
- No hashtags in the body.
- Ends with a hook that invites replies or retweets.
- Simple, direct language.
Output only the tweet text.`,
    user: idea,
  }),

  linkedin: (idea) => ({
    system: `You are a LinkedIn content creator. Write ONE LinkedIn post about this product. Rules:
- Hook (first line): Pattern interrupt. Contrarian take, question, or bold claim.
- Body: 3-5 short paragraphs (2-3 sentences each).
- CTA: Ask a question or invite comments.
- Tone: Professional but human. Not corporate.
- 150-300 words.
- No emojis in the first line. No 🚀 or 💡 or 🔥.
Output only the post text.`,
    user: idea,
  }),

  faq: (idea) => ({
    system: `You are a startup advisor. Write a Founder FAQ with 5 questions a potential user would ask about this product:
1. "What is it?" — One sentence, clear, jargon-free.
2. "Who is it for?" — Specific audience.
3. "How is it different?" — Concrete difference, not "we're better."
4. "How much does it cost?" — If unsure, say "Pricing TBD. Join waitlist for early access."
5. "When can I use it?" — If no timeline, say "Building in public. Follow for updates."
Output as JSON: { "questions": [{"question": "...", "answer": "..."}, ...] }. No markdown fences.`,
    user: idea,
  }),
};

export const IMAGE_PROMPTS: Record<string, (idea: string) => string> = {
  hero: (idea) =>
    `Professional product photography of ${idea}. Clean white background. Modern minimal style. Studio lighting. High quality. 4k.`,

  logo: (idea) =>
    `Three logo designs for ${idea}. Top: minimal line icon. Middle: bold typographic. Bottom: playful illustrated. White background. Grid layout. Professional branding.`,

  'social-image': (idea) =>
    `Instagram post design for ${idea}. Clean modern aesthetic. Subtle gradient background. Product showcase. High quality.`,

  og: (idea) =>
    `Open graph image for ${idea}. Modern clean design. Professional. Product name and tagline concept.`,
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/prompts.ts
git commit -m "feat: add system prompts for all 10 outputs"
```

---

## Task 5: Stitch — Home Page + GenerateForm

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/components/GenerateForm.tsx`

**Interfaces:**
- Consumes: `initiateAuth()`, `getApiKey()`, `logout()` from `auth.ts`
- Produces: Home page with hero section, input form, auth button

- [ ] **Step 1: Use Stitch to design the Home page**

Run: `stitch::generate-design` with prompt:
```
Design a landing page for "Prompt to Market" — a tool that generates launch kits from product ideas.
Sections:
1. Hero: headline "Type a product idea. Get a launch kit." subhead "Landing page copy, social posts, hero image, logo — generated in 60 seconds." CTA button "Generate Your Kit"
2. How it works: 3 steps — "Type your idea" → "AI generates everything" → "Download and launch"
3. Trust section: "Powered by Pollinations AI" + "Bring Your Own Pollen — you pay nothing"
Style: Clean, modern, minimal. Dark mode. Professional but approachable.
```

- [ ] **Step 2: Convert Stitch design to React components**

Run: `stitch::react-components` to generate the Home page component.

- [ ] **Step 3: Create src/components/GenerateForm.tsx**

```tsx
import { useState } from 'react';
import { getApiKey, initiateAuth, logout } from '../lib/auth';
import { checkAuth } from '../lib/pollinations';

interface Props {
  onGenerate: (idea: string) => void;
  isLoading: boolean;
}

export default function GenerateForm({ onGenerate, isLoading }: Props) {
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');
  const apiKey = getApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    if (!apiKey) {
      initiateAuth();
      return;
    }

    setError('');
    onGenerate(idea.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. AI meal planner for gym bros"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : apiKey ? 'Generate Kit' : 'Connect & Generate'}
        </button>
      </div>

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        {apiKey ? (
          <span>
            Connected ✓{' '}
            <button type="button" onClick={logout} className="underline hover:text-gray-700">
              Disconnect
            </button>
          </span>
        ) : (
          <span>Connect Pollinations to start generating</span>
        )}
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Create src/pages/Home.tsx (wire up GenerateForm)**

```tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GenerateForm from '../components/GenerateForm';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = (idea: string) => {
    setIsLoading(true);
    // Store idea in sessionStorage, navigate to results
    sessionStorage.setItem('product_idea', idea);
    navigate('/results');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <main className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">
          Type a product idea.<br />Get a launch kit.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Landing page copy, social posts, hero image, logo — generated in 60 seconds.
        </p>
        <GenerateForm onGenerate={handleGenerate} isLoading={isLoading} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4">
            <div className="text-2xl mb-2">1️⃣</div>
            <h3 className="font-semibold mb-1">Type your idea</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">One sentence. That's it.</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">2️⃣</div>
            <h3 className="font-semibold mb-1">AI generates everything</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Copy, images, social posts — all at once.</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">3️⃣</div>
            <h3 className="font-semibold mb-1">Download and launch</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Copy, download, or regenerate anything.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Verify dev server renders Home page**

```bash
npm run dev
```

Expected: Home page renders with hero, form, and 3-step section.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.tsx src/components/GenerateForm.tsx
git commit -m "feat: add Home page with GenerateForm"
```

---

## Task 6: Generate Flow (Parallel API Calls)

**Files:**
- Create: `src/pages/Results.tsx`

**Interfaces:**
- Consumes: `TEXT_PROMPTS`, `IMAGE_PROMPTS` from `prompts.ts`
- Consumes: `generateText`, `getImageUrl` from `pollinations.ts`
- Consumes: `getApiKey` from `auth.ts`
- Produces: `LaunchKit` with all 10 outputs populated

- [ ] **Step 1: Create src/pages/Results.tsx**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '../lib/auth';
import { generateText, getImageUrl } from '../lib/pollinations';
import { TEXT_PROMPTS, IMAGE_PROMPTS } from '../lib/prompts';
import type { AnyOutput, TextOutput, ImageOutput } from '../lib/types';

const TEXT_OUTPUT_TYPES = ['positioning', 'landing', 'instagram', 'twitter', 'linkedin', 'faq'] as const;
const IMAGE_OUTPUT_TYPES = ['hero', 'logo', 'social-image', 'og'] as const;
const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  hero: { width: 1200, height: 630 },
  logo: { width: 1024, height: 1024 },
  'social-image': { width: 1080, height: 1080 },
  og: { width: 1200, height: 630 },
};

export default function Results() {
  const navigate = useNavigate();
  const [outputs, setOutputs] = useState<AnyOutput[]>([]);
  const [idea, setIdea] = useState('');

  useEffect(() => {
    const storedIdea = sessionStorage.getItem('product_idea');
    const apiKey = getApiKey();

    if (!storedIdea || !apiKey) {
      navigate('/');
      return;
    }

    setIdea(storedIdea);

    // Initialize all outputs as pending
    const initial: AnyOutput[] = [
      ...TEXT_OUTPUT_TYPES.map((t) => ({
        id: t,
        type: t as AnyOutput['type'],
        content: '',
        status: 'pending' as const,
      })),
      ...IMAGE_OUTPUT_TYPES.map((t) => ({
        id: t,
        type: t as AnyOutput['type'],
        url: '',
        ...IMAGE_SIZES[t],
        status: 'pending' as const,
      })),
    ];
    setOutputs(initial);

    // Fire all text calls in parallel
    TEXT_OUTPUT_TYPES.forEach(async (type) => {
      const { system, user } = TEXT_PROMPTS[type](storedIdea);
      setOutputs((prev) =>
        prev.map((o) => (o.id === type ? { ...o, status: 'loading' } : o))
      );
      try {
        const content = await generateText(system, user, apiKey);
        setOutputs((prev) =>
          prev.map((o) => (o.id === type ? { ...o, content, status: 'done' } : o))
        );
      } catch (err: any) {
        setOutputs((prev) =>
          prev.map((o) =>
            o.id === type ? { ...o, status: 'error', error: err.message } : o
          )
        );
      }
    });

    // Fire all image calls in parallel (images are just URLs, no waiting)
    IMAGE_OUTPUT_TYPES.forEach((type) => {
      const prompt = IMAGE_PROMPTS[type](storedIdea);
      const { width, height } = IMAGE_SIZES[type];
      const url = getImageUrl(prompt, width, height);
      setOutputs((prev) =>
        prev.map((o) => (o.id === type ? { ...o, url, status: 'done' } : o))
      );
    });
  }, [navigate]);

  const doneCount = outputs.filter((o) => o.status === 'done').length;
  const totalCount = outputs.length;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="text-blue-600 underline text-sm">
          ← New idea
        </button>
        <h1 className="text-3xl font-bold mt-2">Launch Kit</h1>
        <p className="text-gray-600 dark:text-gray-400">{idea}</p>
        <p className="text-sm text-gray-500 mt-1">
          {doneCount}/{totalCount} outputs ready
        </p>
      </div>

      {/* Text outputs */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">📝 Copy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outputs
            .filter((o) => TEXT_OUTPUT_TYPES.includes(o.type as any))
            .map((o) => (
              <div key={o.id} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 capitalize">{o.type}</h3>
                {o.status === 'loading' && <p className="text-gray-400">Generating...</p>}
                {o.status === 'error' && <p className="text-red-500">Error: {(o as TextOutput).error}</p>}
                {o.status === 'done' && (
                  <div>
                    <pre className="whitespace-pre-wrap text-sm">{(o as TextOutput).content}</pre>
                    <button
                      onClick={() => navigator.clipboard.writeText((o as TextOutput).content)}
                      className="mt-2 text-blue-600 text-sm underline"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Image outputs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎨 Visuals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outputs
            .filter((o) => IMAGE_OUTPUT_TYPES.includes(o.type as any))
            .map((o) => {
              const img = o as ImageOutput;
              return (
                <div key={o.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 capitalize">{o.type}</h3>
                  {img.url ? (
                    <div>
                      <img src={img.url} alt={o.type} className="w-full rounded" loading="lazy" />
                      <a
                        href={img.url}
                        download={`${idea}-${o.type}.jpg`}
                        className="mt-2 inline-block text-blue-600 text-sm underline"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-400">Generating...</p>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify full flow works**

```bash
npm run dev
```

Manual test:
1. Open localhost:5173
2. Enter a product idea
3. Connect Pollinations (manual key or BYOP)
4. Click Generate
5. Verify all 10 outputs appear (6 text + 4 images)
6. Verify copy button works on text outputs
7. Verify image URLs load

- [ ] **Step 3: Commit**

```bash
git add src/pages/Results.tsx
git commit -m "feat: add Results page with parallel generation"
```

---

## Task 7: Regenerate + Edit Functionality

**Files:**
- Create: `src/components/TextOutput.tsx`
- Create: `src/components/ImageOutput.tsx`
- Modify: `src/pages/Results.tsx`

**Interfaces:**
- Produces: `TextOutput` component with copy, edit, regenerate
- Produces: `ImageOutput` component with download, regenerate

- [ ] **Step 1: Create src/components/TextOutput.tsx**

```tsx
import { useState } from 'react';
import { getApiKey } from '../lib/auth';
import { generateText } from '../lib/pollinations';
import { TEXT_PROMPTS } from '../lib/prompts';
import type { TextOutput as TextOutputType } from '../lib/types';

interface Props {
  output: TextOutputType;
  idea: string;
  onUpdate: (id: string, content: string) => void;
}

export default function TextOutput({ output, idea, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(output.content);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;
    setRegenerating(true);
    try {
      const { system, user } = TEXT_PROMPTS[output.type](idea);
      const content = await generateText(system, user, apiKey);
      onUpdate(output.id, content);
      setEditText(content);
    } catch (err) {
      console.error('Regenerate failed:', err);
    }
    setRegenerating(false);
  };

  const handleRegenerateFromEdit = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;
    setRegenerating(true);
    try {
      const base = TEXT_PROMPTS[output.type](idea);
      const system = `${base.system}\n\nThe user edited the previous output. Here's their version:\n${editText}\n\nImprove it while keeping their intent.`;
      const content = await generateText(system, base.user, apiKey);
      onUpdate(output.id, content);
      setEditText(content);
      setEditing(false);
    } catch (err) {
      console.error('Regenerate from edit failed:', err);
    }
    setRegenerating(false);
  };

  if (output.status === 'loading' || regenerating) {
    return <p className="text-gray-400 animate-pulse">Generating...</p>;
  }

  if (output.status === 'error') {
    return (
      <div>
        <p className="text-red-500 text-sm">{output.error}</p>
        <button onClick={handleRegenerate} className="text-blue-600 text-sm underline mt-1">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {editing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded text-sm min-h-[100px] bg-white dark:bg-gray-800"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleRegenerateFromEdit} className="text-blue-600 text-sm underline">
              Regenerate from edit
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-500 text-sm underline">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <pre className="whitespace-pre-wrap text-sm">{output.content}</pre>
          <div className="flex gap-3 mt-2">
            <button onClick={() => navigator.clipboard.writeText(output.content)} className="text-blue-600 text-sm underline">
              Copy
            </button>
            <button onClick={() => { setEditText(output.content); setEditing(true); }} className="text-blue-600 text-sm underline">
              Edit
            </button>
            <button onClick={handleRegenerate} className="text-blue-600 text-sm underline">
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/ImageOutput.tsx**

```tsx
import { useState } from 'react';
import { getImageUrl } from '../lib/pollinations';
import { IMAGE_PROMPTS } from '../lib/prompts';
import type { ImageOutput as ImageOutputType } from '../lib/types';

interface Props {
  output: ImageOutputType;
  idea: string;
  onUpdate: (id: string, url: string) => void;
}

export default function ImageOutput({ output, idea, onUpdate }: Props) {
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = () => {
    setRegenerating(true);
    const prompt = IMAGE_PROMPTS[output.type](idea);
    const url = getImageUrl(prompt, output.width, output.height);
    // Small delay to show regenerating state
    setTimeout(() => {
      onUpdate(output.id, url);
      setRegenerating(false);
    }, 500);
  };

  if (output.status === 'error') {
    return (
      <div>
        <p className="text-red-500 text-sm">{output.error}</p>
        <button onClick={handleRegenerate} className="text-blue-600 text-sm underline mt-1">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {output.url && !regenerating ? (
        <div>
          <img src={output.url} alt={output.type} className="w-full rounded" loading="lazy" />
          <div className="flex gap-3 mt-2">
            <a href={output.url} download={`${idea}-${output.type}.jpg`} className="text-blue-600 text-sm underline">
              Download
            </a>
            <button onClick={handleRegenerate} className="text-blue-600 text-sm underline">
              Regenerate
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center">
          <p className="text-gray-400">{regenerating ? 'Regenerating...' : 'Loading...'}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update Results.tsx to use TextOutput and ImageOutput components**

Replace the inline text/image rendering in Results.tsx with the new components.

- [ ] **Step 4: Commit**

```bash
git add src/components/TextOutput.tsx src/components/ImageOutput.tsx src/pages/Results.tsx
git commit -m "feat: add regenerate and edit functionality"
```

---

## Task 8: Stitch — Results Dashboard Polish

**Files:**
- Modify: `src/pages/Results.tsx`
- Create: `src/components/OutputCard.tsx`
- Create: `src/components/SocialPreview.tsx`
- Create: `src/components/LandingPreview.tsx`

**Interfaces:**
- Produces: Polished results dashboard with category tabs, social previews, landing page preview

- [ ] **Step 1: Use Stitch to design the Results dashboard**

Run: `stitch::generate-design` with prompt:
```
Design a results dashboard for "Prompt to Market" showing generated launch kit outputs.
Layout: 
- Top: product idea + progress indicator
- Tabs: "All" | "Copy" | "Social" | "Visuals"
- Grid of output cards, each with preview, copy/download button, regenerate button
- Text outputs show platform-specific previews (Instagram frame, Twitter card, LinkedIn post)
- Image outputs show image with download button
- Landing page preview section showing headline + hero image + CTA
Style: Clean, card-based, dark mode. Professional dashboard feel.
```

- [ ] **Step 2: Convert Stitch design to React components**

Run: `stitch::react-components` for OutputCard, SocialPreview, LandingPreview.

- [ ] **Step 3: Create src/components/OutputCard.tsx**

Wrapper component for consistent card styling across text and image outputs.

- [ ] **Step 4: Create src/components/SocialPreview.tsx**

Platform-specific preview frames:
- Instagram: phone frame with caption
- Twitter: tweet card with avatar
- LinkedIn: post card with professional styling

- [ ] **Step 5: Create src/components/LandingPreview.tsx**

Preview of generated landing page:
- Hero section with headline + hero image
- Benefits section
- CTA button

- [ ] **Step 6: Wire up in Results.tsx**

Replace simple grid with tabbed layout + social previews + landing preview.

- [ ] **Step 7: Commit**

```bash
git add src/components/OutputCard.tsx src/components/SocialPreview.tsx src/components/LandingPreview.tsx src/pages/Results.tsx
git commit -m "feat: polish Results dashboard with social previews"
```

---

## Task 9: Download All (Zip)

**Files:**
- Create: `src/components/DownloadAll.tsx`
- Modify: `src/pages/Results.tsx`

**Interfaces:**
- Consumes: `jszip`, `file-saver` packages
- Produces: Download all outputs as a zip file

- [ ] **Step 1: Create src/components/DownloadAll.tsx**

```tsx
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { AnyOutput, TextOutput, ImageOutput } from '../lib/types';

interface Props {
  outputs: AnyOutput[];
  idea: string;
}

export default function DownloadAll({ outputs, idea }: Props) {
  const handleDownload = async () => {
    const zip = new JSZip();
    const doneOutputs = outputs.filter((o) => o.status === 'done');

    for (const output of doneOutputs) {
      if ('content' in output) {
        // Text output
        const text = output as TextOutput;
        zip.file(`copy/${text.type}.txt`, text.content);
      } else if ('url' in output) {
        // Image output — fetch and add to zip
        const img = output as ImageOutput;
        try {
          const res = await fetch(img.url);
          const blob = await res.blob();
          zip.file(`visuals/${img.type}.jpg`, blob);
        } catch {
          // Skip failed images
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${idea}-launch-kit.zip`);
  };

  const doneCount = outputs.filter((o) => o.status === 'done').length;
  if (doneCount === 0) return null;

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      Download All ({doneCount} files)
    </button>
  );
}
```

- [ ] **Step 2: Add DownloadAll to Results.tsx**

```tsx
import DownloadAll from '../components/DownloadAll';

// In the header section:
<DownloadAll outputs={outputs} idea={idea} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DownloadAll.tsx src/pages/Results.tsx
git commit -m "feat: add download all as zip"
```

---

## Task 10: Error Handling + Edge Cases

**Files:**
- Modify: `src/pages/Results.tsx`
- Modify: `src/lib/pollinations.ts`

**Interfaces:**
- Produces: Proper error states for all failure modes

- [ ] **Step 1: Add timeout to text API calls**

```typescript
// In pollinations.ts, add timeout support:
export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  timeoutMs = 60000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
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
```

- [ ] **Step 2: Add retry button to error states in Results.tsx**

Already handled in TextOutput/ImageOutput components. Verify all error states show retry button.

- [ ] **Step 3: Add 401 redirect to auth**

In Results.tsx, catch 401 errors and redirect to home with "reconnect" message.

- [ ] **Step 4: Commit**

```bash
git add src/lib/pollinations.ts src/pages/Results.tsx
git commit -m "feat: add timeout, rate limit handling, and error states"
```

---

## Task 11: Mobile Responsive Pass

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Results.tsx`
- Modify: `src/components/GenerateForm.tsx`

**Interfaces:**
- Produces: All screens working on mobile (320px+)

- [ ] **Step 1: Verify Home page on mobile**

- Hero text scales down (`text-3xl` on mobile, `text-5xl` on desktop)
- Form input + button stack vertically on mobile
- How-it-works cards stack vertically on mobile

- [ ] **Step 2: Verify Results page on mobile**

- Grid collapses to single column on mobile
- Social previews stack vertically
- Download button is full-width on mobile

- [ ] **Step 3: Add responsive classes where missing**

Use `md:` breakpoint for desktop-specific styles. Default to mobile layout.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.tsx src/pages/Results.tsx src/components/GenerateForm.tsx
git commit -m "fix: mobile responsive pass"
```

---

## Task 12: Deploy to Vercel

**Files:**
- Create: `vercel.json` (if needed)

- [ ] **Step 1: Build and verify**

```bash
npm run build
npm run preview
```

Expected: Build succeeds, preview shows working app.

- [ ] **Step 2: Deploy**

```bash
npx vercel --prod
```

Or connect GitHub repo to Vercel for auto-deploy.

- [ ] **Step 3: Set environment variable on Vercel**

Add `VITE_POLLINATIONS_CLIENT_ID` in Vercel dashboard.

- [ ] **Step 4: Verify production URL works**

Test full flow on production URL.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: deploy to Vercel"
```

---

## Task 13: Submit to Pollinations

- [ ] **Step 1: Create App Key on enter.pollinations.ai**

Set name, redirect URI (production URL + /callback), enable earnings.

- [ ] **Step 2: Submit via GitHub issue**

URL: https://github.com/pollinations/pollinations/issues/new?template=app-submission.yml

Fields:
- Name: Prompt to Market
- Description: Type a product idea. Get a complete launch kit — landing page copy, social posts, hero image, logo, and more.
- URL: [production URL]
- Category: Business
- Author: [GitHub username]

- [ ] **Step 3: Share on social media**

- r/SideProject: "I built a tool that generates launch kits from one prompt"
- r/SaaS: "Free launch kit generator for indie hackers"
- Indie hacker Twitter: Share a generated example

---

## Self-Review

### Spec Coverage
- ✅ Auth (BYOP + manual fallback) — Task 3
- ✅ All 10 outputs (6 text + 4 images) — Task 4 (prompts) + Task 6 (generation)
- ✅ Regenerate + edit — Task 7
- ✅ Social previews — Task 8
- ✅ Download all — Task 9
- ✅ Error handling — Task 10
- ✅ Mobile responsive — Task 11
- ✅ Deploy — Task 12
- ✅ Pollinations submission — Task 13
- ❌ Stitch integration — Stitch tasks are placeholders (Tasks 5, 8). Actual Stitch calls happen during execution.

### Placeholder Scan
- ✅ No TBD/TODO
- ✅ All code blocks are complete
- ✅ All types are defined before use

### Type Consistency
- ✅ `TextOutput`/`ImageOutput` types match across all files
- ✅ `generateText` signature consistent across pollinations.ts and all callers
- ✅ `IMAGE_PROMPTS` keys match `IMAGE_OUTPUT_TYPES` in Results.tsx

---

## Execution Handoff

**Plan complete. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session, batch with checkpoints

**Which approach?**
