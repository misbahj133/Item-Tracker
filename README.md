# Item Tracker

A tiny full-stack demo app used to showcase a complete testing setup:
frontend component tests, backend API tests, and an end-to-end test.

**Flow:** log in → create an item → see it appear in the list.

## Project structure

```
project/
├── backend/          Express API (auth + items)
│   ├── app.js         Express app (exported, used by tests)
│   ├── server.js       Boots the app on a port
│   └── __tests__/
│       └── api.test.js Jest + Supertest tests (10 tests)
├── frontend/         React app (Vite)
│   ├── src/
│   │   ├── components/  LoginForm, ItemForm, ItemList
│   │   ├── App.jsx
│   │   ├── api.js       fetch() wrapper for the backend
│   │   └── __tests__/   Vitest + React Testing Library tests (7 tests)
└── e2e/              Playwright end-to-end tests
    └── tests/flow.spec.js
```

## Prerequisites

- Node.js 18+
- npm

## 1. Install dependencies

Each part has its own `package.json`, so install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../e2e && npm install && npx playwright install --with-deps chromium
```

## 2. Run the app locally (optional, for manual testing)

In one terminal:

```bash
cd backend
npm start          # starts the API on http://localhost:4000
```

In another terminal:

```bash
cd frontend
npm run dev         # starts the app on http://localhost:5173
```

Log in with the demo account: `admin` / `password123`.

## 3. Run the tests

### Backend tests (Jest + Supertest)

```bash
cd backend
npm test
```

Covers, with both happy-path and failure cases:
- `POST /api/auth/login` — successful login, wrong password, missing fields
- `GET /api/items` — unauthenticated request, authenticated request
- `POST /api/items` — successful create, empty-name validation, unauthenticated request
- `DELETE /api/items/:id` — deleting a missing item, deleting an existing item

### Frontend tests (Vitest + React Testing Library)

```bash
cd frontend
npm test
```

Covers:
- Component rendering (`LoginForm`, `ItemForm`, `ItemList`)
- Form validation (empty login fields, empty item name)
- User interactions (typing + submitting forms, `onLogin`/`onAdd` callbacks firing, input clearing)

### End-to-end test (Playwright)

The Playwright config automatically starts both the backend (`:4000`) and
the frontend dev server (`:5173`) before running, and shuts them down
afterward — you don't need the servers already running for this step,
though it's fine if they are.

```bash
cd e2e
npm test
```

Covers:
- Full happy path: log in → create an item → see it appear in the list
- Failure path: invalid credentials show an error and keep the user on
  the login screen

### Run everything in one go

From the project root:

```bash
(cd backend && npm test) && (cd frontend && npm test) && (cd e2e && npm test)
```

## Notes

- Auth is intentionally simplified (a single mock user, in-memory tokens)
  since this project exists to demonstrate a testing setup, not a
  production auth system.
- Data is stored in memory, so it resets whenever the backend restarts.
