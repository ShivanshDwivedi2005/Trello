from __future__ import annotations

import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), "..", ".env"), extra="ignore")

    database_url: str
    frontend_origin: str = "http://localhost:8080"

    @property
    def sqlalchemy_database_url(self) -> str:
        url = (self.database_url or "").strip().strip('"').strip("'")
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url


settings = Settings()  # type: ignore[call-arg]

