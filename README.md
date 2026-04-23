# 💶 FakeBill Detector

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.5-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

**Plateforme de détection automatique de faux billets en euros par Machine Learning**

[🚀 Demo Live](#) · [📖 API Docs](#) · [📊 Notebook](#)

</div>

---

## 📌 À propos

**FakeBill Detector** est une application complète de détection de contrefaçons de billets en euros.
Elle repose sur l'analyse de **6 mesures géométriques** collectées par machine, invisibles à l'œil nu
mais exploitables par des algorithmes de Machine Learning.

Ce projet couvre l'intégralité du cycle Data Science :
- Analyse exploratoire des données (EDA)
- Entraînement et comparaison de 4 modèles ML
- Déploiement via API REST (FastAPI)
- Interface web moderne (Next.js 14)

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🎯 **Prédiction unitaire** | Saisir les 6 mesures d'un billet → résultat instantané avec score de confiance |
| 📂 **Analyse CSV** | Uploader un fichier CSV → prédiction sur des centaines de billets |
| ⚖️ **Comparateur** | Comparer les 4 modèles ML sur un même billet côte à côte |
| 📈 **Dashboard** | Visualiser les performances (Accuracy, F1, AUC-ROC, courbes radar) |
| 📋 **Historique** | Retrouver toutes les prédictions de la session |

---

## 🤖 Modèles ML

| Modèle | Type | Accuracy | F1-Score | AUC-ROC |
|--------|------|----------|----------|---------|
| **Random Forest** ⭐ | Supervisé | 99.00% | **99.25%** | 99.92% |
| KNN | Supervisé | 98.67% | 99.00% | 99.94% |
| Régression Logistique | Supervisé | 98.67% | 98.99% | 99.95% |
| K-Means | Non supervisé | 98.67% | 99.00% | N/A |

> **Random Forest** est le modèle retenu pour l'API — meilleur F1-Score global.

---

## 📊 Dataset

- **1 500 billets** : 1 000 vrais + 500 faux
- **6 features** : `diagonal`, `height_left`, `height_right`, `margin_low`, `margin_up`, `length`
- **Source** : mesures géométriques en millimètres

---

## 🏗️ Architecture

```
fake-bill-detector/
│
├── 📓 notebook/
│   └── analyse_complete.ipynb     # EDA + 4 modèles + évaluation + PCA
│
├── 🔧 backend/                    # API FastAPI Python 3.12
│   ├── app/
│   │   ├── main.py                # Routes FastAPI + CORS
│   │   ├── predict.py             # Logique ML + chargement pipelines
│   │   ├── schemas.py             # Modèles Pydantic
│   │   └── config.py              # Configuration
│   ├── models/                    # Pipelines .pkl entraînés
│   ├── Dockerfile
│   └── requirements.txt
│
├── 🎨 frontend/                   # Next.js 14 + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx               # Accueil
│   │   ├── predict/               # Prédiction manuelle
│   │   ├── analyse/               # Analyse CSV
│   │   ├── comparateur/           # Comparateur modèles
│   │   ├── dashboard/             # Dashboard performances
│   │   └── historique/            # Historique prédictions
│   ├── components/                # Composants réutilisables
│   └── lib/                       # API calls + types + utils
│
└── 📊 data/
    ├── billets.csv                # Dataset d'entraînement
    └── billets_production.csv    # Dataset de test (sans étiquettes)
```

---

## 🚀 Installation locale

### Prérequis
- Python 3.12
- Node.js 22+
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/ton-username/fake-bill-detector.git
cd fake-bill-detector
```

### 2. Backend FastAPI

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

> ⚠️ Assure-toi d'avoir exécuté le notebook pour générer les fichiers `.pkl` dans `backend/models/`

```bash
uvicorn app.main:app --reload --port 8000
```

L'API est disponible sur `http://localhost:8000`
La documentation Swagger sur `http://localhost:8000/docs`

### 3. Frontend Next.js

```bash
cd frontend
npm install
```

Crée un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

L'interface est disponible sur `http://localhost:3000`

### 4. Notebook (optionnel)

```bash
cd notebook
python -m venv venv
venv\Scripts\activate
pip install -r requirements_notebook.txt
```

Ouvre `analyse_complete.ipynb` dans VS Code et exécute toutes les cellules.

---

## 🌐 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/` | Page d'accueil de l'API |
| `GET` | `/health` | État de l'API + modèles chargés |
| `GET` | `/models` | Liste des modèles disponibles |
| `POST` | `/predict/one` | Prédiction d'un seul billet (JSON) |
| `POST` | `/predict/csv` | Prédiction sur fichier CSV uploadé |
| `POST` | `/predict/compare` | Comparaison des 4 modèles |

### Exemple de requête

```bash
curl -X POST "http://localhost:8000/predict/one?model=random_forest" \
  -H "Content-Type: application/json" \
  -d '{
    "diagonal": 171.81,
    "height_left": 104.86,
    "height_right": 104.95,
    "margin_low": 4.52,
    "margin_up": 2.89,
    "length": 112.83
  }'
```

### Exemple de réponse

```json
{
  "is_genuine": true,
  "label": "Vrai billet",
  "confidence": 0.9987,
  "model_used": "random_forest"
}
```

---

## 🚢 Déploiement Railway

### Backend
1. Créer un nouveau service sur [Railway](https://railway.app)
2. Connecter le repo GitHub → dossier `backend/`
3. Railway détecte automatiquement le `Dockerfile`
4. Copier l'URL générée (ex: `https://fakebill-api.railway.app`)

### Frontend
1. Créer un second service Railway
2. Connecter le repo → dossier `frontend/`
3. Ajouter la variable d'environnement :
   ```
   NEXT_PUBLIC_API_URL=https://fakebill-api.railway.app
   ```
4. Railway build et déploie automatiquement

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| **ML / Data** | Python 3.12, Scikit-learn, Pandas, NumPy, Plotly |
| **Backend** | FastAPI, Uvicorn, Pydantic, Joblib |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| **Déploiement** | Railway (Backend + Frontend) |
| **Versionning** | Git + GitHub |

---

## 👩‍💻 Auteure

**Sona KOULIBALY**
Mastère Big Data & Data Strategy

---

## 📄 Licence

Ce projet est réalisé dans le cadre d'un projet académique.