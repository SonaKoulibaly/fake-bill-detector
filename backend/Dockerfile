# =============================================================================
# Dockerfile — Backend FastAPI
# Image légère Python 3.12 pour Railway
# =============================================================================

FROM python:3.12-slim

# Répertoire de travail dans le conteneur
WORKDIR /backend

# Copie des dépendances en premier (optimise le cache Docker)
COPY requirements.txt .

# Installation des dépendances sans cache pip
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste du code
COPY . .

# Port exposé (Railway utilise la variable PORT automatiquement)
EXPOSE 8000

# Commande de démarrage

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
