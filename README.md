# CRM Pro

A sample Customer Relationship Management app.

- **Frontend:** React + TypeScript (Vite), styled with Tailwind CSS and shadcn/ui components.
- **Backend:** Java 17 + Spring Boot REST API with **in-memory persistence** (data is seeded on startup and reset on restart).
- **End-to-end tests:** Playwright, driving the real UI against the real backend.

The Dashboard is the landing screen and reproduces the provided design: KPI cards,
recent activity, performance leaderboard, recently created contacts, and upcoming tasks.

## Project structure

```
factory/
├── backend/    # Spring Boot REST API (in-memory stores)
├── frontend/   # React + Vite + Tailwind + shadcn/ui
└── e2e/        # Playwright end-to-end tests
```

## Prerequisites

- Java 17+
- Node.js 20+ (uses npm)

## Running the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API starts on <http://localhost:8080>. Data is seeded in-memory on startup.

### REST endpoints

| Method | Path                 | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| GET    | `/api/dashboard`     | Aggregated dashboard payload             |
| GET    | `/api/contacts`      | List contacts                            |
| POST   | `/api/contacts`      | Create a contact                         |
| PUT    | `/api/contacts/{id}` | Update a contact                         |
| DELETE | `/api/contacts/{id}` | Delete a contact                         |
| ...    | `/api/companies`     | Same CRUD shape as contacts              |
| ...    | `/api/deals`         | Same CRUD shape as contacts              |
| ...    | `/api/tasks`         | Same CRUD shape as contacts              |
| GET    | `/api/activities`    | List activities (POST to create)         |

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on <http://localhost:5173> and proxies `/api/*` to the backend
on port 8080 (see `vite.config.ts`), so run the backend first.

### Useful frontend scripts

```bash
npm run build   # type-check + production build
npm run lint    # eslint
```

## End-to-end tests

```bash
cd e2e
npm install
npx playwright install --with-deps chromium
npm test           # run the suite headless
npm run test:ui    # interactive runner
npm run report     # open the last HTML report
```

Playwright boots both servers itself (`webServer` in `e2e/playwright.config.ts`):
the backend on 8080 and the Vite dev server on 5173. To run against servers that
are already running, set `E2E_BASE_URL` (e.g. `E2E_BASE_URL=http://localhost:5173 npm test`),
which disables the managed servers; `E2E_FRONTEND_PORT` / `E2E_BACKEND_PORT`
override the managed ports.

The suite covers the dashboard (KPI cards, panels, API-failure handling), sidebar
navigation and deep links, and create/read/delete for contacts, companies, deals
and tasks. Because backend state is shared and in-memory, specs run
single-threaded and clean up the records they create.

## Notes

- Persistence is in-memory only (`ConcurrentHashMap`), so all data resets when the
  backend restarts. Swapping in a real database means replacing the classes under
  `backend/src/main/java/com/crm/repository`.
- CI (`.github/workflows/ci.yml`) runs the backend tests, the frontend lint/build,
  and the Playwright suite, uploading the HTML report as an artifact.
