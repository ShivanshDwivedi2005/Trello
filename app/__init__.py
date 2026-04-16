import os

# Alias package for backend/app when running Uvicorn from the repo root.
# This allows `uvicorn app.main:app --reload` to work without changing code.
__path__ = [os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app"))]
