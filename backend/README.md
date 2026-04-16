# Trello Clone Backend (FastAPI + Postgres)

## Tech stack
- FastAPI
- SQLAlchemy 2.x
- Alembic migrations
- PostgreSQL

## Setup (Windows / PowerShell)

Create a virtual environment and install deps:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start Postgres (recommended via Docker). From repo root:

```bash
docker compose up -d db
```

Create tables and seed sample data:

```bash
cd backend
alembic upgrade head
python -m app.seed
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

API docs:
- Swagger UI at `http://localhost:8000/docs`

## Assumptions
- No authentication: a default workspace and default user exist.
- Ordering is stored using `position` integers on lists/cards (supports drag-and-drop).
- A board fetch returns its full nested shape (lists + cards + labels/members/checklists).

