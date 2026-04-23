# =============================================================================
# config.py — Configuration centralisée de l'application
#
# Toutes les variables d'environnement sont lues ici via pydantic-settings.
# En développement : valeurs par défaut.
# En production (Railway) : variables définies dans le dashboard Railway.
# =============================================================================

from pydantic_settings import BaseSettings
from pathlib import Path

# Dossier racine du backend
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Paramètres globaux de l'application."""

    # --- Serveur ---
    APP_NAME: str = "Fake Bill Detector API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # --- CORS : origines autorisées à appeler l'API ---
    # En production, remplace * par l'URL exacte de ton frontend Railway
    ALLOWED_ORIGINS: list[str] = ["*"]

    # --- Chemins vers les modèles ML ---
    MODELS_DIR: Path = BASE_DIR / "models"

    class Config:
        env_file = ".env"          # lit le fichier .env si présent
        env_file_encoding = "utf-8"


# Instance unique importée partout dans l'app
settings = Settings()