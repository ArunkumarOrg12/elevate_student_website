# EmployIQ — Student Portal · CLAUDE.md

This file is the authoritative reference for Claude Code when working on this project.
Read it before making any changes.

---

## Project Overview

**EmployIQ** is an AI-powered student employability intelligence portal.
It tracks a student's skills across four categories (Aptitude, Technical, Behavioral, Communication),
visualises growth over semesters, and surfaces personalised recommendations to help students
land placement opportunities.

**Target users:** Final-year engineering students at Indian colleges.
**Mock student:** Arjun Sharma, NIT Trichy, CSE 2021–2025.

---

## Tech Stack

| Layer | Library / Tool |
|-------|---------------|
| Framework | React 19 (JSX, functional components, hooks) |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v3 + custom CSS-in-JSX for page-level styles |
| Charts | Recharts v3 |
| Icons | lucide-react |
| HTTP client | axios (configured in `src/services/api.js`) |
| Build | Vite 8 |
| State | Local `useState` / Context API (`SidebarContext`) — no Redux currently |

---

## Project Structure

```
src/
├── App.jsx                   # Routes: /sign-in (public), /* (AppShell protected)
├── main.jsx                  # Entry point
├── index.css                 # Tailwind base + shared utilities / animations
│
├── pages/                    # One file per route
│   ├── SignIn.jsx
│   ├── Dashboard.jsx
│   ├── MyAssessments.jsx
│   ├── SkillInsights.jsx
│   ├── GrowthTimeline.jsx
│   ├── Recommendations.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
│
├── components/
│   ├── layout/               # AppShell, Sidebar, Header, MobileDrawer
│   ├── common/               # StatCard, CategoryBadge, PriorityBadge, ProgressBar, TabGroup
│   ├── dashboard/            # WelcomeSection, StatsRow, EmployabilityScore, …
│   ├── assessments/          # AssessmentCard, AssessmentStats, AssessmentFilters
│   ├── skills/               # RadarChart, SkillHeatmap, InsightCard, …
│   ├── growth/               # FrequencyChart, CategoryComparison, PeriodComparison
│   ├── recommendations/      # ActionItemCard, QuickWinsSidebar, ProTipCard
│   ├── reports/              # ReportTypeCard, ExportOptions, ReportPreview
│   └── settings/             # SettingsSidebar, ProfileForm
│
├── context/
│   └── SidebarContext.jsx    # Collapsed state for desktop sidebar
│
├── data/
│   └── mockData.js           # All static data — single source of truth
│
├── services/
│   └── api.js                # axios instance, Bearer token interceptor, studentAPI endpoints
│
└── utils/
    └── helpers.js
```

---

## Routing Rules

```
/sign-in          → <SignIn />          — public, no AppShell
/                 → redirect /dashboard
/dashboard        → <Dashboard />
/assessments      → <MyAssessments />
/skill-insights   → <SkillInsights />
/growth-timeline  → <GrowthTimeline />
/recommendations  → <Recommendations />
/reports          → <Reports />
/settings         → <Settings />
```

Protected routes are nested inside `<AppShell />` which renders `<Sidebar>` + `<Header>` + `<Outlet>`.
New public pages (e.g. sign-up, forgot-password) must be added **outside** the AppShell route, same as `/sign-in`.

---

## Design System

### Brand

- **Product name:** EmployIQ
- **Tagline:** Intelligence Portal
- **Logo:** Zap icon (lucide-react) inside an `indigo-600` rounded square

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `indigo-600` | `#4F46E5` | Primary accent, active nav, CTA buttons, logo |
| `indigo-700` | `#4338CA` | Button hover |
| `#1E293B` | slate-800 | Sidebar background, body text |
| `#0F172A` | slate-900 | Deep dark (sign-in left panel, hero backgrounds) |
| `#F8FAFC` | slate-50 | Main content background |
| `#FFFFFF` | — | Card backgrounds, form panels |
| `emerald-500` | `#10B981` | Positive changes, "active/online" badges |
| `amber-500` | `#F59E0B` | Warnings, medium priority |
| `red-500` | `#EF4444` | Errors, negative trends |
| `violet-*` | — | Behavioral category badges |

**Never** introduce new accent colours without updating this table.

### Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Body / UI | `DM Sans` | 400–600 | Loaded via Google Fonts in `index.html` |
| Headings / Numbers | `Plus Jakarta Sans` | 700–800 | `stat-number` class, page titles |
| Monospace | system monospace | — | Code snippets only |

**Do not** use Inter, Roboto, or Arial. Do not add new Google Font imports without updating this table.

### Shared CSS Classes (`index.css`)

| Class | Description |
|-------|-------------|
| `.card` | White card with `rounded-[14px]`, `shadow-card`, `border border-gray-100` |
| `.btn-primary` | Indigo filled button |
| `.btn-secondary` | Ghost button, gray border |
| `.badge-technical` | Blue pill |
| `.badge-aptitude` | Emerald pill |
| `.badge-behavioral` | Violet pill |
| `.badge-communication` | Amber pill |
| `.stat-number` | Plus Jakarta Sans, bold, tight letter-spacing |
| `.page-enter` | Fade+slide-up page animation (0.35 s) |
| `.hover-lift` | translateY(-2px) on hover |
| `.progress-fill` | Animated width via `--target-width` CSS var |
| `.animate-delay-{100–500}` | Staggered animation helpers |

### Shadows (Tailwind config)

```
shadow-card       → subtle card shadow
shadow-card-hover → deeper on hover
```

### Spacing & Radius

- Cards: `rounded-[14px]`
- Buttons: `rounded-[9px]`
- Small badges / chips: `rounded-full`
- Page padding: `p-4 md:p-6`
- Max content width: `max-w-7xl mx-auto`

### Assessment Categories — always use these exact strings

`Technical` · `Aptitude` · `Behavioral` · `Communication`

---

## Component Conventions

1. **One default export per file.** No named component exports.
2. **Props over context** for leaf components. Only `SidebarContext` is global.
3. **Data comes from `src/data/mockData.js`** — import named exports directly. Do not inline mock data inside components.
4. **Charts:** Use Recharts. Wrap in a `ResponsiveContainer`. Tooltip styles follow the `.recharts-tooltip-wrapper` rule in `index.css`.
5. **Icons:** lucide-react only. Pass `style={{ width: N, height: N }}` when overriding Tailwind icon sizes.
6. **Animations:** CSS-only (`@keyframes` in `index.css` or scoped `<style>` tags). Use `animationDelay` + `animationFillMode: 'both'` for stagger effects. No external animation libraries.
7. **Inline `<style>` tags** are acceptable inside page-level components (e.g. `SignIn.jsx`) for page-specific styles that don't belong in the global stylesheet.
8. **No TypeScript.** Keep everything in `.jsx` / `.js`.

---

## API Layer (`src/services/api.js`)

- Base URL: `VITE_API_BASE_URL` env var, defaults to `http://localhost:8000`
- Auth: Bearer token stored in `localStorage` under key `token`
- All endpoints are under `/api/student/…`
- The `api` instance returns `res.data` directly (response interceptor)
- Available endpoints: `getProfile`, `getDashboard`, `getAssessments`, `getSkills`, `getGrowth`, `getRecommendations`, `getReports`

---

## Pages — Purpose Summary

| Page | Path | What it shows |
|------|------|--------------|
| SignIn | `/sign-in` | Auth entry — email/password + Google/Microsoft SSO |
| Dashboard | `/dashboard` | Overview: employability score, stats row, progress timeline, top skills, milestones, improvement actions |
| My Assessments | `/assessments` | History of all assessment attempts with filters and stats |
| Skill Insights | `/skill-insights` | Radar chart, skill heatmap, individual scores, improvement roadmap |
| Growth Timeline | `/growth-timeline` | Frequency chart, category comparison bar chart, period-over-period comparison |
| Recommendations | `/recommendations` | Prioritised action items, quick wins sidebar, pro tips |
| Reports | `/reports` | Downloadable report types, export options, preview |
| Settings | `/settings` | Profile form, notification preferences |

---

## Do's and Don'ts

### Do
- Keep the dark sidebar (`#1E293B`) and light content (`#F8FAFC`) split consistent across all authenticated pages.
- Use `indigo-600` as the single primary action colour everywhere.
- Add staggered `animationDelay` to lists/cards for perceived performance.
- Reuse `.card`, `.btn-primary`, `.btn-secondary` from `index.css`.
- Import all mock data from `src/data/mockData.js`.
- Use `page-enter` class on the root div of every page component.

### Don't
- Don't add Redux or Zustand — state is local or Context.
- Don't introduce new third-party UI libraries (no shadcn, MUI, Chakra, etc.).
- Don't add TypeScript or change file extensions to `.tsx`.
- Don't create new global CSS variables outside of `index.css` `:root`.
- Don't use purple gradients on white — the brand uses indigo on dark or white cleanly.
- Don't place new pages inside AppShell if they're public/unauthenticated.
- Don't add `react-redux` imports — it's in node_modules but not wired up.

---

## Running the Project

```bash
npm run dev      # Vite dev server (default: http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

Environment variable (optional):
```
VITE_API_BASE_URL=http://localhost:8000
```
