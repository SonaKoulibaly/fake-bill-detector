// =============================================================================
// api.ts — Fonctions d'appel à l'API FastAPI
// Toutes les requêtes HTTP sont centralisées ici.
// La base URL est lue depuis la variable d'environnement NEXT_PUBLIC_API_URL
// =============================================================================

import axios from 'axios'
import {
  BilletInput, PredictionResult, CSVPredictionResponse,
  ModelCompareResponse, HealthResponse, ModelId
} from './types'

// URL de base de l'API — définie dans .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 secondes max
  headers: { 'Content-Type': 'application/json' }
})

// -----------------------------------------------------------------------------
// Endpoints
// -----------------------------------------------------------------------------

/** Vérifie que l'API est en ligne et les modèles chargés */
export async function checkHealth(): Promise<HealthResponse> {
  const res = await api.get<HealthResponse>('/health')
  return res.data
}

/** Prédit si un billet est vrai ou faux avec le modèle choisi */
export async function predictOne(
  billet: BilletInput,
  model: ModelId = 'random_forest'
): Promise<PredictionResult> {
  const res = await api.post<PredictionResult>(
    `/predict/one?model=${model}`,
    billet
  )
  return res.data
}

/** Analyse un fichier CSV complet */
export async function predictCSV(
  file: File,
  model: ModelId = 'random_forest'
): Promise<CSVPredictionResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post<CSVPredictionResponse>(
    `/predict/csv?model=${model}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return res.data
}

/** Compare les 4 modèles sur un même billet */
export async function compareModels(
  billet: BilletInput
): Promise<ModelCompareResponse> {
  const res = await api.post<ModelCompareResponse>('/predict/compare', billet)
  return res.data
}

/** Liste les modèles disponibles */
export async function getModels() {
  const res = await api.get('/models')
  return res.data
}