# 💶 FakeBill Detector

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.5-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

**Plateforme de détection automatique de faux billets en euros par Machine Learning**

[🚀 Demo Live](https://fakebill-detector-frontend.up.railway.app) · [📖 API Docs](https://fake-bill-detector-production.up.railway.app/docs) · [📊 Notebook](notebook/analyse_complete.ipynb)

</div>

---

## 📌 À propos

**FakeBill Detector** est une application end-to-end de détection de contrefaçons de billets en euros, basée sur l'analyse de **6 mesures géométriques** collectées par machine — des différences invisibles à l'œil nu mais exploitables par des algorithmes de Machine Learning.

Ce projet couvre l'intégralité du cycle Data Science :

- Analyse exploratoire approfondie (EDA) avec visualisations interactives
- Entraînement, tuning et comparaison de 4 modèles ML (supervisés + non supervisé)
- Exposition via API REST production-ready (FastAPI + Pydantic)
- Interface web moderne et responsive (Next.js 14 + TypeScript)
- Déploiement cloud continu via Railway (CI/CD GitHub)

---

## 🚀 Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | [fakebill-detector-frontend.up.railway.app](https://fakebill-detector-frontend.up.railway.app) |
| ⚙️ API | [fake-bill-detector-production.up.railway.app](https://fake-bill-detector-production.up.railway.app) |
| 📖 Swagger | [.../docs](https://fake-bill-detector-production.up.railway.app/docs) |

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🎯 **Prédiction unitaire** | Saisir les 6 mesures d'un billet → prédiction instantanée avec score de confiance |
| 📂 **Analyse CSV** | Uploader un fichier CSV → analyse en batch avec statistiques globales |
| ⚖️ **Comparateur de modèles** | Comparer les 4 algorithmes ML sur un même billet en temps réel |
| 📈 **Dashboard** | Métriques de performance (Accuracy, F1, AUC-ROC, courbes ROC, radar) |
| 📋 **Historique** | Traçabilité complète des prédictions de session |

---

## 🤖 Résultats des modèles

| Modèle | Type | Accuracy | F1-Score | AUC-ROC |
|--------|------|:--------:|:--------:|:-------:|
| **Random Forest** ⭐ | Supervisé | 99.00% | **99.25%** | 99.92% |
| K-Nearest Neighbors | Supervisé | 98.67% | 99.00% | 99.94% |
| Régression Logistique | Supervisé | 98.67% | 98.99% | 99.95% |
| K-Means | Non supervisé | 98.67% | 99.00% | — |

> **Random Forest** est le modèle retenu en production — meilleur F1-Score global après GridSearchCV.

Tous les modèles intègrent un pipeline sklearn complet (SimpleImputer → StandardScaler → Modèle) garantissant l'absence de data leakage et une inférence robuste en production.

---

## 📊 Dataset

- **1 500 billets** : 1 000 vrais + 500 faux (ratio 2:1 géré via `class_weight='balanced'`)
- **6 features** : `diagonal`, `height_left`, `height_right`, `margin_low`, `margin_up`, `length`
- Valeurs manquantes traitées par imputation médiane dans le pipeline

---

## 🏗️ Architecture

```
fake-bill-detector/
│
├── 📓 notebook/
│   └── analyse_complete.ipynb     # EDA · 4 modèles · GridSearchCV · PCA · ROC
│
├── ⚙️ backend/                    # API REST — FastAPI + Python 3.12
│   ├── app/
│   │   ├── main.py                # Routes + CORS + lifespan
│   │   ├── predict.py             # Logique ML — chargement pipelines
│   │   ├── schemas.py             # Modèles Pydantic — validation I/O
│   │   └── config.py              # Settings — variables d'environnement
│   ├── models/                    # Pipelines .pkl (joblib)
│   ├── Dockerfile
│   └── requirements.txt
│
├── 🎨 frontend/                   # Next.js 14 · TypeScript · Tailwind CSS
│   ├── app/
│   │   ├── page.tsx               # Accueil
│   │   ├── predict/               # Prédiction manuelle
│   │   ├── analyse/               # Analyse CSV en batch
│   │   ├── comparateur/           # Comparateur 4 modèles
│   │   ├── dashboard/             # Dashboard performances
│   │   └── historique/            # Historique prédictions
│   ├── components/                # Composants réutilisables
│   └── lib/                       # API client · types · utils
│
└── 📊 data/
    ├── billets.csv                # Dataset d'entraînement (1 500 billets)
    └── billets_production.csv    # Dataset production (sans étiquettes)
```

---

## 🌐 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/health` | État de l'API + modèles chargés |
| `GET` | `/models` | Liste des modèles disponibles |
| `POST` | `/predict/one` | Prédiction d'un billet (JSON) |
| `POST` | `/predict/csv` | Prédiction batch sur fichier CSV |
| `POST` | `/predict/compare` | Comparaison des 4 modèles |

**Exemple :**

```bash
curl -X POST "https://fake-bill-detector-production.up.railway.app/predict/one?model=random_forest" \
  -H "Content-Type: application/json" \
  -d '{"diagonal": 171.81, "height_left": 104.86, "height_right": 104.95,
       "margin_low": 4.52, "margin_up": 2.89, "length": 112.83}'
```

```json
{
  "is_genuine": true,
  "label": "Vrai billet",
  "confidence": 0.9987,
  "model_used": "random_forest"
}
```

---

## 🛠️ Stack technique

| Couche | Technologies |
|--------|-------------|
| **ML / Data** | Python 3.12 · Scikit-learn · Pandas · NumPy · Plotly · Joblib |
| **Backend** | FastAPI · Uvicorn · Pydantic v2 · Pydantic-Settings |
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · Recharts · Axios |
| **Déploiement** | Railway · Docker · GitHub CI/CD |

---

## ⚙️ Installation locale

```bash
git clone https://github.com/SonaKoulibaly/fake-bill-detector.git
cd fake-bill-detector
```

**Backend :**
```bash
cd backend && python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend :**
```bash
cd frontend && npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

---

## 👩‍💻 Auteure

**Sona KOULIBALY** — Mastère Big Data & Data Strategy

[![GitHub](https://img.shields.io/badge/GitHub-SonaKoulibaly-181717?style=flat&logo=github)](https://github.com/SonaKoulibaly)