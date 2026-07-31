# Prompt to Market — Complete Rewrite & Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILLS: `superpowers:subagent-driven-development` (recommended) and `impeccable` for every UI pass. Use `prism-full` for security/debugging review before final merge.

**Goal:** Rewrite the Prompt-to-Market client-side React app with a bold orange + black visual identity, richer motion design, and a more polished, high-conversion UX. Preserve all product logic, BYOP auth, Pollinations API integration, and history features. Back up the existing UI first.

**Architecture:** Keep the Vite + React + TypeScript + Tailwind stack. Replace the current zinc/indigo palette with a strict orange/black design-token system. Rebuild components with purposeful animations, micro-interactions, and a clear visual hierarchy. No new backend. No new dependencies unless required for motion.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Pollinations API, `framer-motion` (only if CSS alone cannot deliver requested motion), JSZip, file-saver.

## Global Constraints

- **No backend.** No server, no database, no serverless functions.
- **BYOP only.** No Stripe, no subscriptions, no payments.
- **Auth:** Legacy fragment flow (`#api_key=sk_...`) with manual fallback. Keep `lib/auth.ts` behavior unchanged.
- **Base URL:** `https://gen.pollinations.ai`
- **Text endpoint:** `POST /v1/chat/completions` (OpenAI-compatible)
- **Image endpoint:** `GET /image/{prompt}?model=flux&width=W&height=H`
- **Image key param:** `?key=sk_...` query param (per vault docs)
- **Image prompts must be visual scenes, not concepts.** Keep current enhancer prompts.
- **Deploy:** GitHub Pages static site. Use `HashRouter`, not `BrowserRouter`.
- **Sidebar:** Always visible on desktop; connect button hides when connected.
- **All outputs:** 10 total (6 text + 4 images). Do not add outputs.
- **History:** Keep localStorage history, reload, and clear features.
- **No dead buttons.** Every interactive element must have a real action.
- **Security audit:** Run `prism-full` before final commit.

---

## Visual Direction

### Palette: Orange + Black

Primary identity is high-energy orange on deep black. Use orange as the single accent; everything else is grayscale or subtle warm neutrals.

```css
/* Design tokens (CSS custom properties in :root) */
--bg-base: #0a0a0a;           /* pure black background */
--bg-elevated: #141414;       /* cards, sidebar */
--bg-sunken: #050505;         /* hero sections, footer */
--surface-border: #262626;    /* 1px borders */
--surface-border-subtle: #1a1a1a;
--orange-500: #f97316;        /* primary accent */
--orange-400: #fb923c;        /* hover, focus rings */
--orange-600: #ea580c;        /* active state */
--orange-glow: rgba(249, 115, 22, 0.25);
--text-primary: #fafafa;
--text-secondary: #a3a3a3;
--text-muted: #525252;
--text-error: #f87171;
--text-success: #34d399;
```

### Typography

- Headings: `Inter` or system sans, tight tracking (`tracking-tight`), font-weight 800 for H1.
- Body: `Inter`, weight 400, line-height relaxed (`leading-relaxed`).
- Eyebrows/labels: uppercase, tracking-widest, text-xs, text-orange-400.

### Motion Language

- Entrances: `fade-up` from 24px, 0.5s, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Stagger: 60–100ms between sibling elements.
- Hover: buttons lift `-translate-y-0.5` + orange glow; cards border brightens.
- Loading: orange pulsing bars, not generic spinners.
- Progress bar: fixed top, orange gradient, smooth width transitions.
- Route transitions: subtle fade when navigating between Home and Results.

### Component Identity

- **Cards:** rounded-xl (`rounded-2xl`), 1px border, subtle gradient overlay from transparent to `bg-elevated`.
- **Buttons:** rounded-lg, orange background, black text, glow on hover. Secondary buttons: transparent with orange border.
- **Inputs:** dark elevated background, orange focus ring, placeholder in muted.
- **Badges:** small uppercase pill, either orange or neutral.

---

## File Map (After Redesign)

```
prompt-to-market/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg (update to orange/black)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                 # tokens + keyframes + utilities
│   ├── lib/
│   │   ├── pollinations.ts       # keep API logic, add ?key= param
│   │   ├── prompts.ts            # keep prompts, no change
│   │   ├── auth.ts               # keep behavior, no change
│   │   ├── history.ts            # keep behavior, no change
│   │   └── types.ts              # keep types, no change
│   ├── pages/
│   │   ├── Home.tsx              # rewrite visual design
│   │   ├── Callback.tsx          # restyle only
│   │   └── Results.tsx           # rewrite visual design + motion
│   └── components/
│       ├── GenerateForm.tsx      # rewrite styling, keep logic
│       ├── OutputCard.tsx        # new generic wrapper
│       ├── TextOutput.tsx        # restyle copy/edit/regenerate
│       ├── ImageOutput.tsx       # restyle download/regenerate
│       ├── DownloadAll.tsx       # restyle zip button
│       ├── Sidebar.tsx           # extract history sidebar
│       ├── ProgressBar.tsx       # new orange top progress
│       ├── AuthStatus.tsx        # new connected/disconnected badge
│       └── EmptyState.tsx        # new first-run illustration
└── docs/superpowers/
    ├── specs/prompt-to-market-design.md
    └── plans/YYYY-MM-DD-prompt-to-market-redesign.md  # this file
```

---

## Pre-Implementation: Backup

### Task 0: Backup Existing UI

**Files:**
- Create: `.archive/2026-07-31-ui-backup/src/pages/Home.tsx`
- Create: `.archive/2026-07-31-ui-backup/src/pages/Results.tsx`
- Create: `.archive/2026-07-31-ui-backup/src/pages/Callback.tsx`
- Create: `.archive/2026-07-31-ui-backup/src/components/GenerateForm.tsx`
- Create: `.archive/2026-07-31-ui-backup/src/index.css`
- Create: `.archive/2026-07-31-ui-backup/src/App.tsx`
- Create: `.archive/2026-07-31-ui-backup/tailwind.config.js`

**Step 1:** Copy the listed source files verbatim into `.archive/2026-07-31-ui-backup/`, preserving directory structure.

Run:
```bash
cd /root/workspace/prompt-to-market
mkdir -p .archive/2026-07-31-ui-backup/src/{pages,components}
cp src/pages/Home.tsx src/pages/Results.tsx src/pages/Callback.tsx .archive/2026-07-31-ui-backup/src/pages/
cp src/components/GenerateForm.tsx .archive/2026-07-31-ui-backup/src/components/
cp src/index.css src/App.tsx tailwind.config.js .archive/2026-07-31-ui-backup/
```

**Step 2:** Verify backup.

Run:
```bash
ls -la .archive/2026-07-31-ui-backup/src/pages/
ls -la .archive/2026-07-31-ui-backup/src/components/
```

Expected: all listed files present.

**Step 3:** Commit.

```bash
git add .archive
git commit -m "chore: backup existing UI before redesign"
```

---

## Phase 1: Foundation

### Task 1: Switch to HashRouter

**Files:**
- Modify: `src/main.tsx`

**Step 1:** Replace `BrowserRouter` with `HashRouter`.

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
```

**Step 2:** Verify build.

Run: `npm run build`
Expected: build succeeds, no router errors.

**Step 3:** Commit.

```bash
git add src/main.tsx
git commit -m "fix: use HashRouter for GitHub Pages"
```

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: CSS custom properties for orange/black palette.
- Produces: Tailwind `colors.orange` extension using token hex values.
- Produces: Animation keyframes `fade-up`, `fade-in`, `slide-in-left`, `scale-in`, `pulse-bar`, `glow-pulse`.

**Step 1:** Replace `src/index.css` with tokenized styles.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-base: #0a0a0a;
  --bg-elevated: #141414;
  --bg-sunken: #050505;
  --surface-border: #262626;
  --surface-border-subtle: #1a1a1a;
  --orange-500: #f97316;
  --orange-400: #fb923c;
  --orange-600: #ea580c;
  --orange-glow: rgba(249, 115, 22, 0.25);
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --text-muted: #525252;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply antialiased;
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: Inter, system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .animate-fade-up {
    animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-fade-in {
    animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-slide-in-left {
    animation: slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-scale-in {
    animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-pulse-bar {
    animation: pulse-bar 1.4s ease-in-out infinite;
  }
  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse-bar {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(249, 115, 22, 0); }
  50% { box-shadow: 0 0 24px rgba(249, 115, 22, 0.18); }
}
```

**Step 2:** Update `tailwind.config.js`.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        surface: {
          base: '#0a0a0a',
          elevated: '#141414',
          sunken: '#050505',
          border: '#262626',
          'border-subtle': '#1a1a1a',
        },
        ink: {
          primary: '#fafafa',
          secondary: '#a3a3a3',
          muted: '#525252',
        },
      },
      boxShadow: {
        glow: '0 0 32px rgba(249, 115, 22, 0.25)',
        'glow-sm': '0 0 16px rgba(249, 115, 22, 0.18)',
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
```

**Step 3:** Verify Tailwind compiles.

Run: `npm run build`
Expected: build succeeds.

**Step 4:** Commit.

```bash
git add src/index.css tailwind.config.js
git commit -m "design: orange/black tokens and keyframes"
```

---

### Task 3: Extract Sidebar Component

**Files:**
- Create: `src/components/Sidebar.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Results.tsx`

**Interfaces:**
- Consumes: `history: HistoryEntry[]`, `onLoad(entry)`, `onClear()`
- Produces: `Sidebar` reusable component.

**Step 1:** Create `src/components/Sidebar.tsx`.

```tsx
import { useState, useEffect } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '../lib/history';

interface SidebarProps {
  onLoad: (entry: HistoryEntry) => void;
  className?: string;
}

export default function Sidebar({ onLoad, className = '' }: SidebarProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
    const interval = setInterval(() => setHistory(getHistory()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className={`h-full bg-surface-elevated border-r border-surface-border flex flex-col ${className}`}>
      <div className="p-5 border-b border-surface-border">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-secondary">History</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <p className="text-ink-muted text-sm">No generations yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((h) => (
              <div key={h.id} className="group relative bg-surface-base border border-surface-border-subtle rounded-xl p-3 hover:border-orange-500/40 transition-all duration-200">
                <button onClick={() => onLoad(h)} className="text-left w-full">
                  <p className="text-sm font-medium text-ink-primary truncate pr-4">{h.idea}</p>
                  <p className="text-xs text-ink-muted mt-1">{new Date(h.createdAt).toLocaleDateString()} · {h.outputs.length} outputs</p>
                </button>
                <button
                  onClick={() => { deleteHistoryEntry(h.id); setHistory(getHistory()); }}
                  className="absolute top-2 right-2 text-ink-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  aria-label="Delete history entry"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {history.length > 0 && (
        <div className="p-4 border-t border-surface-border">
          <button
            onClick={() => { clearHistory(); setHistory([]); }}
            className="w-full text-xs text-ink-secondary hover:text-red-400 transition-colors"
          >
            Clear all history
          </button>
        </div>
      )}
    </aside>
  );
}
```

**Step 2:** Replace inline sidebars in `Home.tsx` and `Results.tsx` with `<Sidebar />`.

Both pages import:
```tsx
import Sidebar from '../components/Sidebar';
```

Remove duplicated history state and markup. Use a layout shell:
```tsx
<div className="min-h-screen bg-surface-base text-ink-primary flex">
  <div className="hidden md:block w-72 flex-shrink-0">
    <Sidebar onLoad={handleLoadHistory} className="fixed top-0 left-0 w-72 h-screen" />
  </div>
  {/* mobile drawer omitted for brevity — keep existing overlay behavior */}
  <div className="flex-1 min-w-0">
    ...
  </div>
</div>
```

**Step 3:** Verify app still compiles.

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 4:** Commit.

```bash
git add src/components/Sidebar.tsx src/pages/Home.tsx src/pages/Results.tsx
git commit -m "refactor: extract reusable Sidebar component"
```

---

## Phase 2: Home Page Redesign

### Task 4: Rewrite Home.tsx Visual Design

**Files:**
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `GenerateForm`, `Sidebar`
- Produces: visually refreshed Home page.

**Step 1:** Apply orange/black hero layout.

- Background: `bg-surface-base` with a subtle radial gradient overlay centered behind the hero text.
- Eyebrow: “AI-POWERED LAUNCH KIT” in uppercase tracking-widest text-orange-400 text-xs.
- Headline: H1, 4xl md:6xl, font-extrabold, tracking-tight, white.
  - Highlighted word: `<span className="text-orange-500">launch kit</span>`.
- Subhead: `text-ink-secondary text-lg md:text-xl max-w-xl`.
- Feature chips: orange border, transparent background, hover:border-orange-500.
- Footer: subtle border-t surface-border.
- Header nav: `Prompt to Market` logo left, `Connect` button right (hidden when connected using `AuthStatus` component from Task 6).

**Step 2:** Add staggered entrance animations.

- Hero section: `animate-fade-up`.
- Eyebrow, H1, subhead, form, chips: stagger via inline `animation-delay` (0ms, 80ms, 160ms, 240ms, 320ms).

**Step 3:** Verify mobile layout.

- Sidebar hidden on mobile behind hamburger.
- Hero text size reduces on small screens.
- Feature chips wrap.

**Step 4:** Run dev server and visually check.

Run: `npm run dev`
Open: `http://localhost:5173`

**Step 5:** Commit.

```bash
git add src/pages/Home.tsx
git commit -m "design: rewrite Home page in orange/black"
```

---

### Task 5: Rewrite GenerateForm Styling

**Files:**
- Modify: `src/components/GenerateForm.tsx`

**Interfaces:**
- Keep `Props` and logic identical.
- Change all indigo classes to orange equivalents.

**Step 1:** Update color classes.

- Input focus ring: `focus:border-orange-500 focus:ring-1 focus:ring-orange-500`.
- Submit button: `bg-orange-500 hover:bg-orange-600 text-black font-semibold hover:shadow-glow-sm hover:-translate-y-0.5 active:translate-y-0`.
- Connected dot: `bg-emerald-500` (keep green for status).
- Info tip: keep yellow but lower saturation.
- Model select selected row: `text-orange-400 bg-orange-500/10`.

**Step 2:** Add subtle entrance animation.

Wrap form in `animate-fade-up`.

**Step 3:** Verify form still submits and triggers auth.

Run: `npm run dev`, type idea without key, click button → should redirect to Pollinations auth.

**Step 4:** Commit.

```bash
git add src/components/GenerateForm.tsx
git commit -m "design: restyle GenerateForm in orange/black"
```

---

### Task 6: Create AuthStatus Component

**Files:**
- Create: `src/components/AuthStatus.tsx`

**Interfaces:**
- Consumes: `getApiKey`, `logout`
- Produces: connected/disconnected badge, hide-when-connected behavior.

**Step 1:** Implement component.

```tsx
import { getApiKey, logout } from '../lib/auth';

interface Props {
  hiddenWhenConnected?: boolean;
}

export default function AuthStatus({ hiddenWhenConnected = false }: Props) {
  const key = getApiKey();
  if (hiddenWhenConnected && key) return null;

  if (key) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-secondary">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Connected
        <button onClick={logout} className="text-orange-400 hover:text-orange-300 underline ml-1">Disconnect</button>
      </div>
    );
  }

  return (
    <span className="text-sm text-ink-secondary">Connect Pollinations to start generating</span>
  );
}
```

**Step 2:** Use it in Home header.

Replace the inline `connected` check with `<AuthStatus hiddenWhenConnected />`.

**Step 3:** Commit.

```bash
git add src/components/AuthStatus.tsx src/pages/Home.tsx
git commit -m "feat: add AuthStatus component with hide-when-connected"
```

---

## Phase 3: Results Page Redesign

### Task 7: Add ProgressBar Component

**Files:**
- Create: `src/components/ProgressBar.tsx`

**Interfaces:**
- Consumes: `value: number` (0–100)
- Produces: fixed-top progress bar.

**Step 1:** Implement component.

```tsx
interface Props {
  value: number;
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="fixed top-0 left-0 w-full z-[100] h-1 bg-surface-border">
      <div
        className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
```

**Step 2:** Use it in Results instead of inline progress bar.

**Step 3:** Commit.

```bash
git add src/components/ProgressBar.tsx src/pages/Results.tsx
git commit -m "feat: add orange gradient ProgressBar component"
```

---

### Task 8: Create OutputCard Component

**Files:**
- Create: `src/components/OutputCard.tsx`

**Interfaces:**
- Consumes: `output: AnyOutput`, `meta`, `onCopy`, `onRegenerate`, `copiedId`
- Produces: styled card with loading/error/done states.

**Step 1:** Implement component.

Use the existing Results logic, but wrap in an orange-accented card:
- Card: `bg-surface-elevated border border-surface-border rounded-2xl p-5 hover:border-orange-500/30 transition-all duration-200`.
- Badge: small uppercase pill, orange background for copy, neutral for visual.
- Loading: three orange pulsing bars instead of single pulse.
- Error: red text + orange retry link.
- Buttons: icon + text, orange hover.

**Step 2:** Use OutputCard in Results.

Replace the inline card markup in Results.

**Step 3:** Commit.

```bash
git add src/components/OutputCard.tsx src/pages/Results.tsx
git commit -m "feat: create OutputCard with orange accent states"
```

---

### Task 9: Rewrite TextOutput & ImageOutput

**Files:**
- Modify: `src/components/TextOutput.tsx`
- Modify: `src/components/ImageOutput.tsx`

**Interfaces:**
- Keep behavior (copy, edit, regenerate for text; download/regenerate for image).
- Apply orange/black styling.

**Step 1:** TextOutput design.

- Text block: `text-ink-secondary text-sm leading-relaxed whitespace-pre-wrap`.
- Copy button: orange icon, black tooltip/label.
- Regenerate button: orange icon.
- Edit field: dark input with orange focus ring, “Regenerate from edit” button.
- Expand/collapse: orange text.

**Step 2:** ImageOutput design.

- Image container: rounded-xl overflow-hidden, border, subtle shadow.
- Loading: orange pulsing placeholder matching image aspect ratio.
- Download link: orange underline.
- Regenerate button: outlined orange.

**Step 3:** Commit.

```bash
git add src/components/TextOutput.tsx src/components/ImageOutput.tsx
git commit -m "design: restyle TextOutput and ImageOutput in orange/black"
```

---

### Task 10: Rewrite Results.tsx Layout

**Files:**
- Modify: `src/pages/Results.tsx`

**Interfaces:**
- Keep data fetching and state logic unchanged.
- Apply new layout.

**Step 1:** Apply layout.

- Top bar: sticky, `bg-surface-base/90 backdrop-blur border-b border-surface-border`.
- Tab filter: under top bar, orange active indicator.
- Bento grid: keep existing spans, add `animate-fade-up` with stagger.
- “Download All” button: prominent orange pill in top bar.

**Step 2:** Add entrance stagger.

```tsx
style={{ animationDelay: `${index * 60}ms` }}
```

**Step 3:** Empty state.

If no outputs yet (history load failure or direct visit), show an `EmptyState` component (Task 11) with a “Generate New Idea” button.

**Step 4:** Commit.

```bash
git add src/pages/Results.tsx
git commit -m "design: rewrite Results page layout and motion"
```

---

### Task 11: EmptyState & Callback Styling

**Files:**
- Create: `src/components/EmptyState.tsx`
- Modify: `src/pages/Callback.tsx`

**Step 1:** EmptyState.

```tsx
import { useNavigate } from 'react-router-dom';

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <h2 className="text-xl font-semibold text-ink-primary mb-2">No launch kit yet</h2>
      <p className="text-ink-secondary text-sm max-w-xs mb-6">Describe your product idea and we’ll generate everything you need to launch.</p>
      <button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-glow-sm">
        Generate New Idea
      </button>
    </div>
  );
}
```

**Step 2:** Restyle Callback page.

- Centered card with orange spinner.
- Success: green text + redirect.
- Error: red text + orange “Go back” button.

**Step 3:** Commit.

```bash
git add src/components/EmptyState.tsx src/pages/Callback.tsx
git commit -m "design: add EmptyState and restyle Callback"
```

---

## Phase 4: Motion & Polish

### Task 12: Add Route Transition

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Step 1:** Wrap routes in a simple fade container.

```tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function FadeRoutes({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [display, setDisplay] = useState(children);
  useEffect(() => {
    const t = setTimeout(() => setDisplay(children), 0);
    return () => clearTimeout(t);
  }, [location.pathname, children]);
  return <div key={location.pathname} className="animate-fade-in">{display}</div>;
}
```

Use `FadeRoutes` around `<Routes>`.

**Step 2:** Commit.

```bash
git add src/App.tsx src/index.css
git commit -m "feat: add subtle route fade transition"
```

---

### Task 13: Button & Card Micro-Interactions

**Files:**
- Modify: all component files with buttons/cards.

**Step 1:** Audit and unify interaction classes.

Every primary action button:
```
bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg px-5 py-2.5 transition-all duration-200 hover:shadow-glow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
```

Every card:
```
bg-surface-elevated border border-surface-border rounded-2xl transition-all duration-200 hover:border-orange-500/30 hover:shadow-glow-sm
```

**Step 2:** Run visual regression by opening Home and Results in browser.

**Step 3:** Commit.

```bash
git add src/components src/pages
git commit -m "design: unify button and card micro-interactions"
```

---

## Phase 5: Impeccable Passes

Run each pass as a separate command in the project directory. Treat findings as additional tasks before the security audit.

### Task 14: `/impeccable critique`

**Command:**
```bash
cd /root/workspace/prompt-to-market
/impeccable critique src/
```

**Expected output:** UX review with heuristic scoring. Address any medium/high severity findings in a follow-up task.

**Step 1:** Record findings to `.hermes/impeccable/critique-findings.md`.

**Step 2:** Create fix tasks for any issue scored 6/10 or lower.

**Step 3:** After fixes, commit.

---

### Task 15: `/impeccable animate`

**Command:**
```bash
/impeccable animate src/
```

**Expected output:** motion audit — identifies missing or excessive animations.

**Step 1:** Tune animation delays/durations based on findings.

**Step 2:** Reduce any motion flagged as excessive for accessibility.

**Step 3:** Add `prefers-reduced-motion` media query support in `src/index.css`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 4:** Commit.

```bash
git add src/index.css
git commit -m "a11y: respect prefers-reduced-motion"
```

---

### Task 16: `/impeccable color`

**Command:**
```bash
/impeccable color src/
```

**Expected output:** color-system audit — checks contrast, palette consistency, semantic usage.

**Step 1:** Fix any contrast failures, especially orange on black text.

**Step 2:** Ensure no leftover indigo/zinc accent classes remain.

Search:
```bash
grep -R "indigo\|blue-600\|emerald-500" src/ --include="*.tsx" --include="*.css"
```

Only `emerald-500` should remain for connected status. Replace any accidental indigo with orange tokens.

**Step 3:** Commit.

```bash
git add src/
git commit -m "design: color audit fixes"
```

---

### Task 17: `/impeccable polish`

**Command:**
```bash
/impeccable polish src/
```

**Expected output:** final quality pass — spacing, alignment, typography, dead code.

**Step 1:** Fix all polish findings.

**Step 2:** Remove any unused imports or dead markup.

Run:
```bash
npx tsc --noEmit
```

**Step 3:** Commit.

```bash
git add src/
git commit -m "polish: final visual quality pass"
```

---

### Task 18: `/impeccable clarify`

**Command:**
```bash
/impeccable clarify src/
```

**Expected output:** copy audit — labels, error messages, CTAs.

**Step 1:** Improve any unclear labels or error text.

**Step 2:** Ensure all CTAs are action-oriented and specific.

**Step 3:** Commit.

```bash
git add src/
git commit -m "copy: clarify labels and CTAs"
```

---

### Task 19: `/impeccable audit`

**Command:**
```bash
/impeccable audit src/
```

**Expected output:** technical audit (a11y, perf, responsive).

**Step 1:** Fix missing `aria-label`s, low-contrast text, unresponsive layouts.

**Step 2:** Verify all images have alt text.

**Step 3:** Commit.

```bash
git add src/
git commit -m "audit: accessibility and responsive fixes"
```

---

## Phase 6: Security & Debugging

### Task 20: `/prism-full` Security/Debug Review

**Command:**
```bash
/prism-full src/
```

**Expected output:** adversarial structural analysis of the codebase.

**Step 1:** Record findings to `.hermes/prism/security-review.md`.

**Step 2:** Fix any security issues:

- API key must only be sent in `Authorization` header and `?key=` query param for images. Do not log it.
- No keys in localStorage beyond `pollinations_api_key`.
- No `innerHTML` or dangerous DOM insertion.
- Sanitize any user-facing output that might render HTML.

**Step 3:** Verify `lib/pollinations.ts`.

Text call:
```typescript
headers: { Authorization: `Bearer ${apiKey}` }
```

Image call:
```typescript
`${BASE_URL}/image/${encoded}?model=${imageModel}&width=${width}&height=${height}&nologo=true&seed=${seed}&key=${apiKey}`
```

**Step 4:** Commit.

```bash
git add src/lib/pollinations.ts
git commit -m "security: verify API key handling and image key param"
```

---

## Phase 7: Verification & Deploy

### Task 21: Build & Type Check

**Files:** all

**Step 1:** Run type check.

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 2:** Run production build.

```bash
npm run build
```

Expected: build succeeds, `dist/` created.

**Step 3:** Preview locally.

```bash
npm run preview
```

Open `http://localhost:4173`. Verify Home, Results, Callback visually.

**Step 4:** Commit.

```bash
git add dist
git commit -m "chore: production build"
```

---

### Task 22: GitHub Pages Deploy

**Files:**
- Verify: `.github/workflows/deploy.yml`

**Step 1:** Ensure deploy workflow builds to `gh-pages` branch.

Run:
```bash
cat .github/workflows/deploy.yml
```

Expected: workflow triggers on push to `main` or `master`, runs `npm run build`, deploys `dist/`.

**Step 2:** Push.

```bash
git push origin main
```

**Step 3:** Wait for GitHub Actions, then visit the published URL.

---

## Spec Self-Review

- [x] Backup step included before redesign.
- [x] Orange + black palette defined as tokens.
- [x] HashRouter requirement included.
- [x] All 10 outputs preserved.
- [x] BYOP auth preserved.
- [x] History features preserved.
- [x] Impeccable commands: critique, animate, color, polish, clarify, audit.
- [x] prism-full security/debug pass included.
- [x] GitHub Pages deploy included.
- [x] No dead buttons / no placeholder steps.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-31-prompt-to-market-redesign.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per phase, run Impeccable passes between phases, and use `prism-full` before final verification.
2. **Inline Execution** — I execute tasks in this session using `superpowers:executing-plans` with checkpoints.

**Which approach?**
