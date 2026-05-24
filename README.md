# Owner Housing

Property listing website for India. Direct from owners — no brokers, no commission.

**Stack:** TanStack Start (React) · SSG · Vanilla CSS · Firebase Hosting

> ⚠️ This is a closed-source project. Do not distribute or share code externally.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Build + prerender all pages to `dist/client/` |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build + deploy to Firebase Hosting |
| `npm test` | Run tests |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── data/           # properties.json (all listings)
├── routes/         # Pages (file-based routing)
├── utils/          # Helpers (price formatting, SEO)
└── styles.css      # Design system (vanilla CSS, BEM)
scripts/            # Build-time generators
public/             # Static assets (robots.txt, sitemap, llms.txt)
```

## Adding a Property

1. Add an entry to `src/data/properties.json` following the existing schema
2. Add the URL to `public/sitemap.xml`
3. Run `npm run build` — the new page is auto-discovered and prerendered

For multi-property listings (one owner, multiple types like rent/PG/sale), add `"offerings": ["rent", "pg", "buy"]` to the entry. The listing will appear under all matching category filters.

## Styling

All styles live in `src/styles.css`. Use BEM naming: `.block__element--modifier`. Do not use Tailwind utility classes in components.

## SEO

Every page must include:
- Unique `<title>` and meta description
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- JSON-LD structured data (detail pages: `RealEstateListing` + `BreadcrumbList`)

AI crawler files (`llms.txt`, `llms-full.txt`) are auto-generated on build.

## Deployment

First time:
```bash
npx firebase-tools login
```
Update project ID in `.firebaserc`, then:
```bash
npm run deploy
```
Or use VS Code: `Cmd+Shift+P` → `Tasks: Run Task` → **Deploy to Firebase Hosting**
