# CRM Pro

A sample Customer Relationship Management app.

- **Frontend:** React + TypeScript (Vite), styled with Tailwind CSS and shadcn/ui components.
- **Backend:** Java 17 + Spring Boot REST API with **in-memory persistence** (data is seeded on startup and reset on restart).

The Dashboard is the landing screen and reproduces the provided design: KPI cards,
recent activity, performance leaderboard, recently created contacts, and upcoming tasks.

## Project structure

```
factory/
├── backend/    # Spring Boot REST API (in-memory stores)
└── frontend/   # React + Vite + Tailwind + shadcn/ui
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

## Notes

- Persistence is in-memory only (`ConcurrentHashMap`), so all data resets when the
  backend restarts. Swapping in a real database means replacing the classes under
  `backend/src/main/java/com/crm/repository`.
