from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MAY2026 Team 041 API"
    app_env: str = "development"
    api_prefix: str = "/api"
    database_url: str = Field(
        default="postgresql://app:app@localhost:5432/app",
        validation_alias="DATABASE_URL",
    )
    backend_cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
