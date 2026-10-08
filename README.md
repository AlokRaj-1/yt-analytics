# 📺 YT Analytics

A **YouTube Channel & Video Analytics** web app built with React 19, TypeScript, and the YouTube Data API v3.
Styled with a **Neo-Brutalist × Editorial** design — Vivid Red + Black + Warm Off-White.

---

## ✨ Features

- **Channel Overview** — Subscribers, total views, video count, average engagement rate
- **Views Over Time** — Line chart of views across your last 15 videos
- **Likes vs Comments** — Side-by-side grouped bar chart per video
- **Engagement Rate** — Bar chart with channel average reference line
- **Category Breakdown** — Pie chart of videos grouped by YouTube category
- **Video Table** — Sortable by views, likes, comments, engagement, or date — with thumbnail, title, duration, and category badge. Fully keyboard-navigable with ARIA roles
- **Pagination** — Load more videos via YouTube's `pageToken` (50 per page)
- **Comments Panel** — Top comments for any selected video, with like counts and expandable text. XSS-safe via DOMPurify
- **Skeleton Loaders** — Section-level loading states for cards, charts, and table
- **Error Boundary** — Catches React render crashes and shows a styled fallback

---

## 🖥️ Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React + Vite | 19 / 8 |
| Language | TypeScript | ~6.0 |
| Styling | Tailwind CSS | v4 |
| Charts | Recharts | 3 |
| Data Fetching | TanStack React Query (Infinite) | v5 |
| HTTP Client | Axios | 1 |
| Sanitization | DOMPurify | 3 |
| Fonts | Space Grotesk · Inter · JetBrains Mono | — |
| Testing | Vitest | 5 |
| API | YouTube Data API v3 | — |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── types.ts        # App-level TypeScript interfaces (ChannelStats, VideoItem, etc.)
│   ├── youtube.ts      # All YouTube Data API v3 calls — fully typed, zero `any`
│   └── ytTypes.ts      # Raw YouTube API response shapes (YTChannel, YTVideo, etc.)
│
├── components/
│   ├── CategoryPieChart.tsx    # Pie chart — videos by category
│   ├── CommentsPanel.tsx       # Top comments for selected video (DOMPurify sanitized)
│   ├── EngagementChart.tsx     # Bar chart — engagement rate per video
│   ├── ErrorBoundary.tsx       # React error boundary — catches render crashes
│   ├── LikesCommentsChart.tsx  # Grouped bar chart — likes vs comments
│   ├── OverviewCards.tsx       # 4-stat summary strip
│   ├── Skeleton.tsx            # Skeleton loaders for cards, charts, and table
│   ├── VideoTable.tsx          # Sortable, keyboard-accessible video table
│   └── ViewsChart.tsx          # Line chart — views over time
│
├── hooks/
│   ├── useChannelStats.ts  # Channel stats query (TanStack Query)
│   ├── useComments.ts      # Comments query with smart retry (disabled = no retry)
│   └── useVideoStats.ts    # Infinite video query + flattenVideos / buildChartData helpers
│
├── lib/
│   └── env.ts          # Startup env validation — fails fast if API key is missing
│
├── pages/
│   ├── Dashboard.tsx   # Full analytics dashboard with skeleton loading states
│   └── Login.tsx       # Channel ID / @handle / username entry form
│
├── utils/
│   ├── chartTheme.ts       # Shared Recharts Neo-Brutalist theme constants
│   ├── format.ts           # Shared formatters: fmt(), fmtDate(), calcEngagement()
│   └── format.test.ts      # Vitest unit tests for format utilities
│
├── App.tsx             # Root — ErrorBoundary + QueryClient + Login/Dashboard toggle
├── main.tsx            # Entry point — validateEnv() called before render
└── index.css           # Global styles + Neo-Brutalist CSS theme tokens
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/yt-analytics.git
cd yt-analytics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
VITE_YT_API_KEY=your_youtube_data_api_v3_key_here
```

> **Get an API key:** Go to [Google Cloud Console](https://console.cloud.google.com) → Enable **YouTube Data API v3** → Create Credentials → API Key

### 4. Run the dev server

```powershell
# PowerShell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

```bash
# CMD / bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 5. Other commands

```bash
npm run build      # TypeScript check + production build → dist/
npm run preview    # Preview production build locally
npm test           # Run unit tests (Vitest)
npm run test:watch # Run tests in watch mode
npm run lint       # Lint with oxlint
```

---

## 🔑 Channel Input Formats

The login screen accepts all three YouTube channel identifier formats:

| Format | Example |
|---|---|
| Channel ID | `UCX6OQ3DkcsbYNE6H8uQQuVA` |
| Handle | `@MrBeast` |
| Legacy username | `PewDiePie` |

The app automatically detects the format and calls the correct YouTube API parameter (`id=`, `forHandle=`, or `forUsername=`).

**To find a channel ID manually:**
1. Go to the channel on YouTube
2. Click **About** → **Share** → **Copy channel ID**
3. Or view page source → search `"channelId"`

---

## 🎨 Design System

### Palette

| Token | Hex | Usage |
|---|---|---|
| `--red` | `#FF2D20` | Accents, borders, CTAs, chart lines |
| `--black` | `#0A0A0A` | Backgrounds |
| `--dark-gray` | `#1A1A1A` | Secondary panels, alternating table rows |
| `--off-white` | `#F5F0E8` | Text, card backgrounds, secondary chart data |

### Rules

- **Zero border-radius** — hard corners everywhere (`border-radius: 0 !important`)
- **3px solid borders** — black or red only
- **No shadows, no gradients**
- **Hard hover** — red background + black text invert
- **Fonts** — Space Grotesk (display/headings), Inter (body), JetBrains Mono (numbers/stats)

---

## 📊 Engagement Rate Formula

```
Engagement Rate (%) = ((Likes + Comments) / Views) × 100
```

Defined once in `src/utils/format.ts` → `calcEngagement()` and used everywhere.

---

## 🔒 Security

- **XSS protection** — YouTube comment HTML is sanitized via `DOMPurify.sanitize()` with a strict allowlist (`b, i, em, strong, a, br` only) before any `dangerouslySetInnerHTML` render
- **Env validation** — app throws a clear, actionable error at startup if `VITE_YT_API_KEY` is missing or still the placeholder value
- **Zero `any` types** — all YouTube API responses are typed via `src/api/ytTypes.ts`

---

## ♿ Accessibility

- `role="grid"` and `aria-label` on the video table
- `aria-sort` on all sortable column headers (`ascending` / `descending` / `none`)
- `tabIndex={0}` + `onKeyDown` (Enter/Space) on all interactive rows and headers
- Focus styles match hover styles for keyboard users

---

## 🧪 Tests

```bash
npm test
```

```
✓ src/utils/format.test.ts (9 tests)
  ✓ fmt()            — millions, thousands, small numbers
  ✓ fmtDate()        — ISO to readable short date
  ✓ calcEngagement() — rate calculation, rounding, zero-division guard
```

---

## ⚠️ Known Limitations

- Requires a valid YouTube Data API v3 key with quota
- Only public channels and videos are supported
- YouTube API free quota: **10,000 units/day** — each full dashboard load uses ~150–300 units depending on video count and pages loaded
- Comments may be disabled by the creator — the app handles this gracefully with a smart retry strategy that skips retries on 403 errors

---

## 📄 License

MIT
