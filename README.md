# Trello Clone (Frontend + Backend)

This repository contains:
- `task-canvas/`: React + Vite frontend (Trello-like UI)
- `backend/`: FastAPI + PostgreSQL backend

## 1) Backend (FastAPI)

### Option A: PostgreSQL via Docker (recommended)
From repo root:

```bash
docker compose up -d db
```

Then:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

### Option B: PostgreSQL installed locally (no Docker)
- Install PostgreSQL (Windows installer)
- Create a database/user and set `backend/.env`:

`DATABASE_URL=postgresql+psycopg://USER:PASSWORD@localhost:5432/DBNAME`

Then run the same commands as above (alembic, seed, uvicorn).

## 2) Frontend (Vite)

```bash
cd task-canvas
npm install
```

Create `task-canvas/.env`:

```bash
VITE_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Frontend: `http://localhost:8080`  
Backend: `http://localhost:8000/docs`

