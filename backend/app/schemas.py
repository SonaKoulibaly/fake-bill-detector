# =============================================================================
# schemas.py — Modèles de données Pydantic
#
# Pydantic valide automatiquement les données entrantes et sortantes de l'API.
# Si une valeur est manquante ou du mauvais type, FastAPI retourne une erreur
# 422 claire avant même d'appeler la logique métier.
# =============================================================================

from pydantic import BaseModel, Field
from typing import Optional


# -----------------------------------------------------------------------------
# Schémas d'entrée
# -----------------------------------------------------------------------------

class BilletInput(BaseModel):
    """
    Représente les 6 mesures géométriques d'un billet.
    Utilisé pour la prédiction d'un seul billet (endpoint /predict/one).
    """

    diagonal: float = Field(
        ...,
        description="Diagonale du billet en mm",
        example=171.81
    )
    height_left: float = Field(
        ...,
        description="Hauteur à gauche en mm",
        example=104.86
    )
    height_right: float = Field(
        ...,
        description="Hauteur à droite en mm",
        example=104.95
    )
    margin_low: float = Field(
        ...,
        description="Marge basse en mm",
        example=4.52
    )
    margin_up: float = Field(
        ...,
        description="Marge haute en mm",
        example=2.89
    )
    length: float = Field(
        ...,
        description="Longueur du billet en mm",
        example=112.83
    )

    class Config:
        json_schema_extra = {
            "example": {
                "diagonal": 171.81,
                "height_left": 104.86,
                "height_right": 104.95,
                "margin_low": 4.52,
                "margin_up": 2.89,
                "length": 112.83
            }
        }


class ModelChoice(BaseModel):
    """Permet de choisir quel modèle utiliser pour la prédiction."""
    model: str = Field(
        default="random_forest",
        description="Modèle à utiliser : logistic_regression, knn, random_forest, kmeans"
    )


# -----------------------------------------------------------------------------
# Schémas de sortie
# -----------------------------------------------------------------------------

class PredictionResult(BaseModel):
    """Résultat de prédiction pour un seul billet."""

    is_genuine: bool = Field(description="True = vrai billet, False = faux billet")
    label: str = Field(description="'Vrai billet' ou 'Faux billet'")
    confidence: Optional[float] = Field(
        default=None,
        description="Probabilité d'être un vrai billet (0 à 1). None pour KMeans."
    )
    model_used: str = Field(description="Nom du modèle utilisé")


class BilletPrediction(BaseModel):
    """Résultat de prédiction pour un billet dans un CSV."""

    index: int = Field(description="Numéro de ligne dans le CSV")
    is_genuine: bool
    label: str
    confidence: Optional[float] = None
    model_used: str


class CSVPredictionResponse(BaseModel):
    """Réponse complète pour une prédiction sur fichier CSV."""

    total: int = Field(description="Nombre total de billets analysés")
    genuine_count: int = Field(description="Nombre de vrais billets")
    fake_count: int = Field(description="Nombre de faux billets")
    genuine_rate: float = Field(description="Taux de vrais billets (0 à 1)")
    predictions: list[BilletPrediction] = Field(description="Liste des prédictions")
    model_used: str


class ModelCompareResponse(BaseModel):
    """Résultat de comparaison des 4 modèles sur un billet."""

    billet: dict = Field(description="Données du billet analysé")
    results: dict = Field(description="Prédictions de chaque modèle")


class HealthResponse(BaseModel):
    """Réponse du endpoint de santé."""

    status: str
    version: str
    models_loaded: list[str]