# NavYatra — Complete Project Knowledge Base

A single-source reference document for the NavYatra web app. Feed this straight into a bot's knowledge base.

---

## 1. Project Identity

- **Name:** NavYatra
- **Tagline / Sub-heading:** *Know Your India – AI-Powered Intelligent Tourism & Travel Companion*
- **Purpose:** Help users discover Indian travel destinations through an AI recommendation engine, an AI chat assistant ("Bharat Guide"), and rich state-by-state guides covering all 28 Indian states.
- **Developer:** Gauri — B.Tech in Mathematics & Computing, Madhav Institute of Technology and Science (MITS), Gwalior.
- **Type:** Full-stack modern web application (portfolio / educational project).
- **Live URLs:**
  - Preview: `https://id-preview--9acc8957-0e6a-4bf4-b539-70cee522276f.lovable.app`
  - Published: `https://nav-yatra-explorer.lovable.app`

---

## 2. Tech Stack

### Frontend
- **React 19**
- **TanStack Start v1** (full-stack React framework with SSR/SSG)
- **TanStack Router** (file-based routing, type-safe navigation)
- **TanStack Query** (data fetching / caching)
- **TypeScript** (strict mode)
- **Vite 7** (build tool)
- **Tailwind CSS v4** (via native `@import` in `src/styles.css`, no legacy `tailwind.config.js`)
- **Framer Motion** (animations, transitions, floating monument silhouettes)
- **shadcn/ui** components (style: "new-york", base color: slate)
- **Lucide React** (icon set)
- **react-markdown** (renders AI chat responses)
- **Sonner** (toast notifications)

### Backend / Runtime
- **TanStack Start server functions** (`createServerFn` from `@tanstack/react-start`) for typed client → server RPC
- **Cloudflare Workers** runtime target (Edge functions, workerd + nodejs_compat)
- **Node.js compat mode** for server logic

### AI Layer
- **Lovable AI Gateway** (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- **Model:** `google/gemini-2.5-flash`
- Auth header: `Lovable-API-Key` using `LOVABLE_API_KEY` env var (server-side only)

### Auth & Persistence (current state)
- **Authentication:** Local-storage based (no backend DB yet). Users + sessions stored in `localStorage` under keys `navyatra_users` and `navyatra_session`.
- **Wishlist / preferences:** Also local-storage.
- No external database is connected at the moment.

### Fonts
- **Playfair Display** — display / headings (600, 700, 900)
- **Inter** — body text (300–800)
- **Noto Color Emoji** — used to render color emoji glyphs consistently

### Tooling
- **Bun** as package manager (`bunfig.toml`)
- **ESLint** + **Prettier** for lint/format
- **tsgo** for TypeScript checks
- Built and hosted on **Lovable**

---

## 3. Project Structure

```
src/
├── router.tsx                 # TanStack router bootstrap, QueryClient
├── start.ts                   # client-side start config / middleware
├── server.ts                  # server entrypoint
├── styles.css                 # Tailwind v4 + design tokens + theme
├── routeTree.gen.ts           # AUTO-GENERATED, do not edit
│
├── routes/
│   ├── __root.tsx             # root shell: providers, navbar, meta, fonts
│   ├── index.tsx              # landing / hero
│   ├── explore.tsx            # explore-by-interest + search
│   ├── states.index.tsx       # all 28 states grid
│   ├── states.$stateId.tsx    # individual state detail page
│   ├── recommendation.tsx     # 5-step AI quiz
│   ├── assistant.tsx          # Bharat Guide chat UI
│   ├── dashboard.tsx          # user dashboard
│   ├── profile.tsx            # profile + travel badges
│   ├── auth.tsx               # login / signup / forgot password
│   └── about.tsx              # About Incredible India + mission
│
├── components/
│   ├── Navbar.tsx
│   ├── StateCard.tsx
│   └── BackgroundFx.tsx       # AnimatedBlobs background
│
├── lib/
│   ├── ai-gateway.server.ts   # Gemini chat call helper (server-only)
│   ├── chat.functions.ts      # createServerFn: chatWithBharatGuide
│   ├── auth-context.tsx       # AuthProvider (localStorage users/sessions)
│   ├── theme-context.tsx      # ThemeProvider (dark default)
│   ├── wishlist-context.tsx   # WishlistProvider
│   ├── states-data.ts         # 28-state metadata + HEROES image map
│   ├── error-capture.ts
│   ├── error-page.ts
│   ├── lovable-error-reporting.ts
│   └── utils.ts
│
└── hooks/
    └── use-mobile.tsx
```

---

## 4. Routes (Pages)

| Path | File | Purpose |
| --- | --- | --- |
| `/` | `index.tsx` | Hero with typewriter effect, floating 3D monument silhouettes, CTA "Start Exploring", "Explore by Interest" icon cards (Beaches, Mountains, Wildlife, UNESCO, etc.), "Featured Destinations" grid |
| `/explore` | `explore.tsx` | "Explore Incredible India" — searchable/filterable destination cards |
| `/states` | `states.index.tsx` | Grid of all 28 states |
| `/states/$stateId` | `states.$stateId.tsx` | Individual state detail: hero image (46vh), tagline, emoji, capital/best time/budget, Save + Share, two-column grid (Attractions, Cuisine, Festivals, Culture, UNESCO, Wildlife, Adventure, Hill Stations, Beaches), Travel Tips + Fun Facts checklist, stat cards (Budget, Duration, Language, Traditional Dress), Nearby recommendations |
| `/recommendation` | `recommendation.tsx` | 5-step AI quiz → personalized destinations |
| `/assistant` | `assistant.tsx` | "Bharat Guide" chat UI, streams answers from Gemini |
| `/dashboard` | `dashboard.tsx` | Recommendation history, saved places, wishlist, preferences |
| `/profile` | `profile.tsx` | Profile info + travel badges |
| `/auth` | `auth.tsx` | Login / Signup / Forgot password (localStorage) |
| `/about` | `about.tsx` | "About Incredible India" fact cards + "The NavYatra Mission" |

Root shell (`__root.tsx`) wraps every route with: `QueryClientProvider → ThemeProvider → AuthProvider → WishlistProvider → AnimatedBlobs + Navbar + <Outlet /> + Toaster`. Also sets global meta (title, description, OG/Twitter cards, OG image).

---

## 5. Features

### 5.1 AI Recommendation Engine
5-step quiz collecting:
1. Budget
2. Season / travel time
3. Trip vibe (interests: adventure, culture, spiritual, relaxation, wildlife, etc.)
4. Duration
5. Preferred way to reach / transport

Each answer contributes weighted points to destinations; the engine outputs personalized results with:
- Match percentage
- Budget estimate
- Suggested itinerary
- Best time to visit
- Packing suggestions
- Nearby attractions

### 5.2 Bharat Guide (AI Chatbot)
- Route: `/assistant`
- Model: `google/gemini-2.5-flash` via Lovable AI Gateway
- Server function: `chatWithBharatGuide` in `src/lib/chat.functions.ts`
- Sends full conversation history each turn (stateless model)
- Injects a system prompt that includes summarized data for all 28 states (name, capital, region, tagline, best time, budget, duration, top attractions, cuisine, festivals, tags)
- Style: warm, friendly, local-friend tone, markdown formatting, emojis sparingly, always includes why-it-fits + best time + budget + insider tip
- Uses ₹ for budgets, politely redirects off-topic questions
- Suggested prompts shown on first load (e.g., "Best places in Kerala?", "Suggest destinations under ₹10,000", "Compare Goa and Kerala")
- Input validation via Zod (`messages`: 1–30, content 1–4000 chars)
- Error handling in UI: 429 → rate limit toast, 402 → credits exhausted toast

### 5.3 Explore India
Deep info per state: Capital, Languages, Attractions, Cuisine, Festivals, Culture, UNESCO Heritage Sites, Wildlife, Adventure, Hill Stations, Beaches, Budget Guide, Best Time to Visit, Fun Facts, Travel Tips, Traditional Dress.

### 5.4 Authentication (localStorage)
- Signup, Login, Logout, Forgot Password UI
- User record: `{ id, name, email, password, avatar }` in `localStorage["navyatra_users"]`
- Session in `localStorage["navyatra_session"]`
- Avatar auto-generated via DiceBear adventurer style seeded by email

### 5.5 Dashboard
Recommendation history, saved destinations, wishlist, favorites, travel preferences.

### 5.6 Wishlist
Save/bookmark destinations, persisted via `WishlistProvider` in localStorage.

### 5.7 Smart Search
Search by state, city, monument, food, festival, heritage site.

### 5.8 UI / UX
- Glassmorphism cards + solid dark-navy surfaces
- Dark theme default (with light theme support via `ThemeProvider`)
- Rainbow gradient headings (white → orange → pink → purple → teal)
- Framer Motion animations, animated background blobs (`BackgroundFx`)
- Fully responsive
- Color emoji support via Noto Color Emoji

---

## 6. Design System

Defined in `src/styles.css` with OKLCH color tokens.

- **Background (dark):** `oklch(0.14 0.06 268)` — deep navy
- **Primary gradient (`--gradient-primary`):** bright blue → purple family
- **Saffron gradient (`--gradient-saffron`):** rainbow: white → orange → pink → purple → teal, used for `.text-gradient-saffron`
- **Cards:** solid navy base with 8% opacity borders + `.glass` utility for glassmorphism
- **Typography:** Playfair Display for display headings, Inter for body, Noto Color Emoji for emoji glyphs
- **shadcn/ui:** style `new-york`, CSS variables enabled, base color `slate`, icons from `lucide`

---

## 7. Data Model (client-side)

### 28 States (`src/lib/states-data.ts`)
Each state object typically has:
```
{
  id, name, capital, region, tagline, emoji,
  bestTime, budget, duration, language, traditionalDress,
  attractions[], cuisine[], festivals[], culture[],
  unesco[], wildlife[], adventure[], hillStations[], beaches[],
  travelTips[], funFacts[],
  tags[], hero (image URL from HEROES map)
}
```

`HEROES` is a map of `stateId → image URL` supplying real destination photography for every state (Rajasthan, Kerala, Goa, MP, AP, etc.).

### Local storage keys
- `navyatra_users` — array of registered users
- `navyatra_session` — currently logged-in user
- Wishlist key managed by `WishlistProvider`

---

## 8. AI Integration Details

- **Provider helper:** `src/lib/ai-gateway.server.ts` exports `callGeminiChat({ apiKey, system, messages })`
- **Endpoint:** `POST https://ai.gateway.lovable.dev/v1/chat/completions`
- **Headers:** `Content-Type: application/json`, `Lovable-API-Key: <LOVABLE_API_KEY>`
- **Body:** `{ model: "google/gemini-2.5-flash", messages: [system, ...history] }`
- **Server function** `chatWithBharatGuide`:
  - Method: POST
  - Input schema (Zod): `{ messages: [{ role: "user"|"assistant", content: string }] }`
  - Builds system prompt from `STATES` summary, calls Gemini, returns `{ reply }`
- `LOVABLE_API_KEY` is server-only, never exposed to client.

---

## 9. User Flow

```
Landing (/) → Auth (/auth) → Dashboard
    → Recommendation quiz (/recommendation)
    → AI results
    → Explore states (/states, /states/$id)
    → Chat with Bharat Guide (/assistant)
    → Save to Wishlist
```

---

## 10. Meta / SEO

Set in `__root.tsx` `head()`:
- Title: "NavYatra — Know Your India"
- Description: "AI-Powered Intelligent Tourism & Travel Companion. Discover India's 28 states through personalized recommendations."
- OG + Twitter cards with a hosted OG image
- Fonts preconnected to Google Fonts
- Favicon at `/favicon.ico`

---

## 11. Future Enhancements (planned)

- Voice-enabled AI assistant
- AI-generated multi-day itineraries
- Multi-language support
- Hotel recommendations
- Weather integration
- Travel expense planner
- Community reviews
- Offline travel guide

---

## 12. Project Goal

Promote Indian tourism by helping users discover destinations tailored to their interests while educating them about India's diverse culture, heritage, cuisine, traditions, and natural beauty through an engaging AI-powered platform covering all 28 states.
