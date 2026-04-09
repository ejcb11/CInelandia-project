from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "Pizza Planeta API"
    app_version: str = "1.0.0"
    app_description: str = "API para gestionar pedidos de Pizza Planeta 🚀🍕"
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    cors_origins: List[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]
    database_url: str = "sqlite:///./pizza_planeta.db"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()