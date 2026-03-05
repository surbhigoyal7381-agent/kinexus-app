<!-- Copilot / AI agent instructions tailored to Kinexus app -->
# Copilot Instructions — Kinexus App

Summary
- This is a small React single-page marketing/demo app (Create React App) using Tailwind CSS. Much of the app logic and data lives in `src/App.js` rather than split across many routes.

Quick start (developer)
- Install dependencies: `npm install`
- Start local dev server: `npm start` (CRA dev server on port 3000)
- Start with Docker Compose: `docker-compose up -d` (service maps port `3001:3000`)
- Build production: `npm run build`
- Key files: [package.json](package.json), [docker-compose.yml](docker-compose.yml), [Dockerfile](Dockerfile)

Architecture notes (big picture)
- Single-page controller: `src/App.js` implements an internal `navigate(view, params)` router and contains most views/components (home, industries, useCases, contact, admin). See the App controller and state at [src/App.js](src/App.js#L564-L596).
- Small component files are present under `src/components/` (e.g., `Navigation.js`, `Hero.js`, `Features.js`), but the canonical app view renderer is inside `src/App.js` (so edit there first when changing page flows).
- Styling: Tailwind utilities are used across the app; additional global CSS and design tokens are injected via the `styles` string in `src/App.js` (`<style>{styles}</style>`). Prefer editing `tailwind.config.js` for token-level changes and `index.css` for global Tailwind directives.

Data & runtime conventions
- Local seeded data: initial content is defined inside `src/App.js` as `INITIAL_INDUSTRIES` and `INITIAL_USE_CASES`. These are persisted in localStorage under keys: `kinexus_industries`, `kinexus_useCases`, `kinexus_leads`. See data seeds and localStorage initialization near the top of [src/App.js](src/App.js#L1-L120) and the main app state at [src/App.js](src/App.js#L564-L596).
- Icon mapping: icons use `lucide-react` and are referenced by string names (e.g. `'Factory'`, `'Truck'`). The code uses an `ICON_MAP` + `getIcon(name)` lookup — the string must match the exported lucide icon name. See [src/App.js](src/App.js#L1-L40).
- Leads capture: contact form stores leads to `localStorage` synchronously (no backend). Admin download/clear operations operate on that same storage.

Runtime & env specifics
- Environment variable: `REACT_APP_API_URL` is set in `Dockerfile` and `docker-compose.yml` (note: docker-compose sets `REACT_APP_API_URL: http://localhost:3001` while Dockerfile sets `http://localhost:3000`). Verify which you expect when debugging container vs host dev.
- Ports: CRA dev server defaults to port `3000`. Docker maps container port `3000` to host `3001` (`docker-compose.yml`).

Patterns & gotchas for contributors / agents
- Editing pages: although `src/components/` exists, many views are embedded inside `src/App.js`. Changing navigation or page layout usually requires editing the `renderView` switch and the `navigate()` usage at [src/App.js](src/App.js#L564-L596).
- Avoid adding new top-level routes assuming `react-router` — the project uses an internal `navigate` state controller. There is a `react-router-dom` dependency and a separate `Navigation.js` that uses `Link`, but the app's active routing is internal. If you convert to `react-router`, update `Navbar`/`Navigation.js` accordingly.
- Tailwind: keep utility-first classes in JSX. For global tokens (colors/fonts), prefer `tailwind.config.js` for theme changes, or update the `styles` string in `src/App.js` for one-off variables.

Examples (use these as templates)
- Add a new industry: follow the shape in `INITIAL_INDUSTRIES` — `{ id, name, icon, desc, hero, subhead, gap, pain, solution }`. Use an icon string that matches `lucide-react` exports.
- Persisting data programmatically: update state (e.g., `setIndustries`) and sync to `localStorage` under `kinexus_industries` to keep behavior consistent with existing admin flows.

Testing & debugging
- Dev server logs: run `npm start` and open browser console for client errors.
- Container debugging: `docker-compose logs -f` and ensure `REACT_APP_API_URL` is correct for the environment.

When to ask the human
- If you need to add a new backend integration (API), ask where to place API client code (current app is frontend-only and no standard API client exists).
- If you plan to migrate to `react-router`, confirm desired route structure and whether to remove the embedded view components from `src/App.js`.

Files to review first
- [src/App.js](src/App.js) — main app controller, data seeds, views
- [package.json](package.json) — scripts and dependencies
- [docker-compose.yml](docker-compose.yml) and [Dockerfile](Dockerfile) — container behavior and env
- [tailwind.config.js](tailwind.config.js) and [postcss.config.js](postcss.config.js)

Feedback
- If any section is unclear or you want more examples (e.g., step-by-step to add a page or integrate an API), tell me which area and I'll expand this file.
