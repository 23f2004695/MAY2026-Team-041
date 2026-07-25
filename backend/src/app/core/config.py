from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MAY2026 Team 041 API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    database_url: str = Field(
        default="postgresql://app:app@localhost:5432/app",
        validation_alias="DATABASE_URL",
    )
    backend_cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    jwt_secret: str = Field(
        default="dev-secret-change-me-32-bytes-minimum", validation_alias="JWT_SECRET"
    )
    jwt_algorithm: str = "HS256"
    google_client_id: str = Field(default="", validation_alias="GOOGLE_CLIENT_ID")
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
