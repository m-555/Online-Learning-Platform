from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, read from environment variables (and an optional .env file)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "Aula API"
    api_v1_prefix: str = "/api"

    # Database — PostgreSQL. Override via the DATABASE_URL environment variable
    # (docker-compose and CI set this); the default targets a local Postgres instance.
    database_url: str = "postgresql+psycopg2://aula:aula@localhost:5432/aula"

    # Auth
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # CORS — comma-separated list of allowed origins for the Next.js frontend.
    cors_origins: str = "http://localhost:3000"

    # Frontend base URL, used when composing email verification links.
    frontend_url: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
