# =============================================================================
# predict.py — Logique de prédiction ML
#
# Ce module gère :
#   1. Le chargement des pipelines .pkl au démarrage de l'app (une seule fois)
#   2. La prédiction pour un billet unique
#   3. La prédiction pour un fichier CSV complet
#   4. La comparaison des 4 modèles sur un billet
#
# Les pipelines contiennent déjà le StandardScaler et le SimpleImputer,
# donc aucun prétraitement supplémentaire n'est nécessaire ici.
# =============================================================================

import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional

from app.config import settings
from app.schemas import (
    BilletInput, PredictionResult, BilletPrediction,
    CSVPredictionResponse, ModelCompareResponse
)

# -----------------------------------------------------------------------------
# Chargement des modèles (effectué une seule fois au démarrage)
# -----------------------------------------------------------------------------

# Dictionnaire global contenant tous les modèles chargés
_models: dict = {}

# Ordre des colonnes attendu par les pipelines (doit correspondre à l'entraînement)
FEATURE_COLUMNS = [
    'diagonal', 'height_left', 'height_right',
    'margin_low', 'margin_up', 'length'
]

# Mapping nom court → fichier .pkl
MODEL_FILES = {
    'logistic_regression': 'pipeline_lr.pkl',
    'knn':                 'pipeline_knn.pkl',
    'random_forest':       'pipeline_rf.pkl',
    'kmeans':              'pipeline_kmeans.pkl',
}


def load_models() -> None:
    """
    Charge tous les pipelines .pkl depuis le dossier models/.
    Appelé une seule fois au démarrage de l'application FastAPI (lifespan).
    Lève une exception si un fichier est manquant.
    """
    global _models

    for model_name, filename in MODEL_FILES.items():
        path = Path(settings.MODELS_DIR) / filename

        if not path.exists():
            raise FileNotFoundError(
                f"Modèle introuvable : {path}\n"
                f"Assure-toi d'avoir exécuté le notebook pour générer les .pkl"
            )

        _models[model_name] = joblib.load(path)
        print(f"  ✅ {model_name:25s} chargé depuis {filename}")

    print(f"\n  {len(_models)} modèles chargés avec succès.")


def get_loaded_models() -> list[str]:
    """Retourne la liste des modèles actuellement chargés."""
    return list(_models.keys())


# -----------------------------------------------------------------------------
# Fonctions utilitaires
# -----------------------------------------------------------------------------

def _billet_to_df(billet: BilletInput) -> pd.DataFrame:
    """
    Convertit un objet BilletInput en DataFrame avec les colonnes
    dans le bon ordre pour les pipelines sklearn.
    """
    return pd.DataFrame([{
        'diagonal':     billet.diagonal,
        'height_left':  billet.height_left,
        'height_right': billet.height_right,
        'margin_low':   billet.margin_low,
        'margin_up':    billet.margin_up,
        'length':       billet.length,
    }])[FEATURE_COLUMNS]


def _predict_with_model(model_name: str, X: pd.DataFrame) -> tuple[bool, Optional[float]]:
    """
    Effectue une prédiction avec le modèle spécifié.

    Retourne :
        - is_genuine (bool) : True si le billet est jugé vrai
        - confidence (float | None) : probabilité d'être vrai, None pour KMeans
    """
    if model_name not in _models:
        raise ValueError(f"Modèle '{model_name}' non disponible. "
                         f"Choix : {list(_models.keys())}")

    if model_name == 'kmeans':
        # KMeans : bundle spécial (model + scaler + genuine_cluster)
        bundle         = _models['kmeans']
        km_model       = bundle['model']
        km_scaler      = bundle['scaler']
        genuine_cluster = bundle['genuine_cluster']

        X_scaled   = km_scaler.transform(X)
        cluster    = km_model.predict(X_scaled)[0]
        is_genuine = bool(cluster == genuine_cluster)
        confidence = None  # KMeans ne fournit pas de probabilités

    else:
        # Modèles supervisés : pipeline complet (imputer + scaler + modèle)
        pipeline   = _models[model_name]
        pred       = pipeline.predict(X)[0]
        proba      = pipeline.predict_proba(X)[0]
        is_genuine = bool(pred == 1)
        confidence = round(float(proba[1]), 4)  # probabilité d'être vrai

    return is_genuine, confidence


# -----------------------------------------------------------------------------
# Endpoints logiques
# -----------------------------------------------------------------------------

def predict_one(billet: BilletInput, model_name: str = 'random_forest') -> PredictionResult:
    """
    Prédit si un seul billet est vrai ou faux.

    Args:
        billet      : les 6 mesures géométriques du billet
        model_name  : modèle à utiliser (défaut : random_forest)

    Returns:
        PredictionResult avec label, is_genuine et confidence
    """
    X = _billet_to_df(billet)
    is_genuine, confidence = _predict_with_model(model_name, X)

    return PredictionResult(
        is_genuine=is_genuine,
        label="Vrai billet" if is_genuine else "Faux billet",
        confidence=confidence,
        model_used=model_name
    )


def predict_csv(df: pd.DataFrame, model_name: str = 'random_forest') -> CSVPredictionResponse:
    """
    Prédit la nature de chaque billet dans un DataFrame CSV.

    Args:
        df         : DataFrame avec les 6 colonnes de features
        model_name : modèle à utiliser

    Returns:
        CSVPredictionResponse avec statistiques et liste des prédictions
    """
    # Vérification des colonnes requises
    missing_cols = set(FEATURE_COLUMNS) - set(df.columns)
    if missing_cols:
        raise ValueError(f"Colonnes manquantes dans le CSV : {missing_cols}")

    # Garder uniquement les colonnes nécessaires dans le bon ordre
    X = df[FEATURE_COLUMNS]

    predictions = []

    for i, row in X.iterrows():
        row_df = pd.DataFrame([row])
        is_genuine, confidence = _predict_with_model(model_name, row_df)

        predictions.append(BilletPrediction(
            index=int(i),
            is_genuine=is_genuine,
            label="Vrai billet" if is_genuine else "Faux billet",
            confidence=confidence,
            model_used=model_name
        ))

    # Calcul des statistiques globales
    genuine_count = sum(1 for p in predictions if p.is_genuine)
    fake_count    = len(predictions) - genuine_count
    genuine_rate  = round(genuine_count / len(predictions), 4) if predictions else 0.0

    return CSVPredictionResponse(
        total=len(predictions),
        genuine_count=genuine_count,
        fake_count=fake_count,
        genuine_rate=genuine_rate,
        predictions=predictions,
        model_used=model_name
    )


def compare_models(billet: BilletInput) -> ModelCompareResponse:
    """
    Prédit avec les 4 modèles en parallèle pour comparer leurs résultats.

    Args:
        billet : les 6 mesures géométriques du billet

    Returns:
        ModelCompareResponse avec les résultats de chaque modèle
    """
    X = _billet_to_df(billet)
    results = {}

    for model_name in _models.keys():
        is_genuine, confidence = _predict_with_model(model_name, X)
        results[model_name] = {
            'is_genuine': is_genuine,
            'label':      "Vrai billet" if is_genuine else "Faux billet",
            'confidence': confidence
        }

    return ModelCompareResponse(
        billet=billet.model_dump(),
        results=results
    )