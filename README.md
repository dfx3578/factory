# CRM Pro

Sample CRM app: React + TypeScript frontend and a Java Spring Boot REST API with in-memory persistence.

## Run

```bash
cd backend && ./mvnw spring-boot:run     # http://localhost:8080
cd frontend && npm install && npm run dev # http://localhost:5173 (proxies /api -> :8080)
```

## Backend

Spring Boot 3.3 / Java 17. Every entity is stored in a thread-safe `ConcurrentHashMap` via
`InMemoryRepository<T>`, and `DataSeeder` repopulates sample data on each startup (data is lost on
restart). Swapping in a real database means replacing the classes in
`backend/src/main/java/com/crm/repository`.

| Endpoint | Description |
| --- | --- |
| `GET /api/dashboard` | KPI cards, recent activity, leaderboard, recent contacts, upcoming tasks |
| `/api/contacts` | CRUD |
| `/api/companies` | CRUD |
| `/api/deals` | CRUD |
| `/api/tasks` | CRUD |
| `/api/activities` | CRUD |

CRUD resources support `GET /`, `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`.

## Frontend

React 19 + Vite + Tailwind. `ResourcePage<T>` renders the list/create/delete table for each entity
from a `columns` + `fields` config; the Dashboard renders `/api/dashboard`.

## Checks

```bash
cd backend  && ./mvnw test
cd frontend && npm run lint && npm run build
```
