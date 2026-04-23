# =============================================================================
# main.py — Point d'entrée de l'API FastAPI
#
# Structure des endpoints :
#   GET  /              → page d'accueil (santé de l'API)
#   GET  /health        → état des modèles chargés
#   POST /predict/one   → prédiction d'un seul billet (JSON)
#   POST /predict/csv   → prédiction sur fichier CSV uploadé
#   POST /predict/compare → comparaison des 4 modèles sur un billet
#   GET  /models        → liste des modèles disponibles
# =============================================================================

from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from app.config import settings
from app.schemas import (
    BilletInput, PredictionResult, CSVPredictionResponse,
    ModelCompareResponse, HealthResponse
)
from app import predict as ml


# -----------------------------------------------------------------------------
# Lifespan : chargement des modèles au démarrage, libération à l'arrêt
# -----------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestionnaire de cycle de vie de l'application.
    Les modèles sont chargés UNE SEULE FOIS au démarrage → performances optimales.
    """
    print("\n🚀 Démarrage de l'API — chargement des modèles ML...")
    ml.load_models()
    print("✅ API prête à recevoir des requêtes\n")
    yield
    # Code après yield = nettoyage à l'arrêt (optionnel ici)
    print("🛑 Arrêt de l'API")


# -----------------------------------------------------------------------------
# Création de l'application FastAPI
# -----------------------------------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## 💶 Fake Bill Detector API

API de détection automatique de faux billets en euros.

### Fonctionnalités
- **Prédiction unitaire** : analysez un billet en saisissant ses 6 mesures
- **Prédiction CSV** : uploadez un fichier CSV pour analyser des centaines de billets
- **Comparateur** : comparez les résultats des 4 modèles ML sur un même billet

### Modèles disponibles
- `logistic_regression` : rapide et interprétable
- `knn` : K-Nearest Neighbors optimisé par GridSearchCV
- `random_forest` : meilleur modèle (F1 = 0.9925) ⭐
- `kmeans` : clustering non supervisé (sans probabilité)
    """,
    lifespan=lifespan,
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
)

# -----------------------------------------------------------------------------
# Middleware CORS
# Permet au frontend Next.js d'appeler l'API depuis un domaine différent
# -----------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # ["*"] en dev, URL frontend en prod
    allow_credentials=True,
    allow_methods=["*"],    # GET, POST, OPTIONS, etc.
    allow_headers=["*"],    # Authorization, Content-Type, etc.
)


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@app.get("/", tags=["Général"])
async def root():
    """Page d'accueil — vérifie que l'API est en ligne."""
    return {
        "message": "💶 Fake Bill Detector API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "online"
    }


@app.get("/health", response_model=HealthResponse, tags=["Général"])
async def health():
    """
    Endpoint de santé — vérifie que tous les modèles sont bien chargés.
    Utilisé par Railway pour les health checks.
    """
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        models_loaded=ml.get_loaded_models()
    )


@app.get("/models", tags=["Modèles"])
async def list_models():
    """Liste tous les modèles ML disponibles avec leur description."""
    return {
        "models": [
            {
                "id": "logistic_regression",
                "name": "Régression Logistique",
                "type": "supervisé",
                "description": "Modèle linéaire rapide et interprétable"
            },
            {
                "id": "knn",
                "name": "K-Nearest Neighbors",
                "type": "supervisé",
                "description": "Classification par voisinage, optimisé par GridSearchCV"
            },
            {
                "id": "random_forest",
                "name": "Random Forest",
                "type": "supervisé",
                "description": "Meilleur modèle — F1 = 0.9925 ⭐"
            },
            {
                "id": "kmeans",
                "name": "K-Means",
                "type": "non supervisé",
                "description": "Clustering — pas de probabilité de confiance"
            }
        ]
    }


@app.post("/predict/one", response_model=PredictionResult, tags=["Prédiction"])
async def predict_one(
    billet: BilletInput,
    model: str = Query(
        default="random_forest",
        description="Modèle à utiliser : logistic_regression, knn, random_forest, kmeans"
    )
):
    """
    Prédit si un seul billet est vrai ou faux.

    - **billet** : les 6 mesures géométriques (en mm)
    - **model** : modèle ML à utiliser (défaut : random_forest)

    Retourne la prédiction avec le score de confiance (sauf KMeans).
    """
    try:
        result = ml.predict_one(billet, model_name=model)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {str(e)}")


@app.post("/predict/csv", response_model=CSVPredictionResponse, tags=["Prédiction"])
async def predict_csv(
    file: UploadFile = File(..., description="Fichier CSV avec les 6 colonnes de features"),
    model: str = Query(
        default="random_forest",
        description="Modèle à utiliser"
    )
):
    """
    Analyse un fichier CSV complet et retourne les prédictions pour chaque billet.

    Le CSV doit contenir ces colonnes (séparateur virgule ou point-virgule) :
    `diagonal, height_left, height_right, margin_low, margin_up, length`

    La colonne `is_genuine` est ignorée si présente.
    """
    # Vérification du type de fichier
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Le fichier doit être au format .csv"
        )

    try:
        # Lecture du contenu du fichier uploadé
        contents = await file.read()
        # Détection automatique du séparateur (; ou ,)
        sample = contents[:1000].decode('utf-8')
        sep = ';' if sample.count(';') > sample.count(',') else ','

        df = pd.read_csv(io.BytesIO(contents), sep=sep)

        # Suppression de la colonne cible si présente (mode production)
        if 'is_genuine' in df.columns:
            df = df.drop(columns=['is_genuine'])

        result = ml.predict_csv(df, model_name=model)
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement : {str(e)}")


@app.post("/predict/compare", response_model=ModelCompareResponse, tags=["Prédiction"])
async def compare_models(billet: BilletInput):
    """
    Compare les prédictions des 4 modèles ML sur un même billet.

    Utile pour visualiser les différences entre modèles dans le frontend.
    Retourne les résultats de tous les modèles en une seule requête.
    """
    try:
        result = ml.compare_models(billet)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {str(e)}")