// =============================================================================
// types.ts — Interfaces TypeScript
// Correspondent exactement aux schémas Pydantic du backend FastAPI
// =============================================================================

export interface BilletInput {
  diagonal: number
  height_left: number
  height_right: number
  margin_low: number
  margin_up: number
  length: number
}

export interface PredictionResult {
  is_genuine: boolean
  label: string
  confidence: number | null
  model_used: string
}

export interface BilletPrediction {
  index: number
  is_genuine: boolean
  label: string
  confidence: number | null
  model_used: string
}

export interface CSVPredictionResponse {
  total: number
  genuine_count: number
  fake_count: number
  genuine_rate: number
  predictions: BilletPrediction[]
  model_used: string
}

export interface ModelResult {
  is_genuine: boolean
  label: string
  confidence: number | null
}

export interface ModelCompareResponse {
  billet: BilletInput
  results: {
    logistic_regression: ModelResult
    knn: ModelResult
    random_forest: ModelResult
    kmeans: ModelResult
  }
}

export interface HealthResponse {
  status: string
  version: string
  models_loaded: string[]
}

export type ModelId = 'logistic_regression' | 'knn' | 'random_forest' | 'kmeans'

export interface ModelInfo {
  id: ModelId
  name: string
  type: string
  description: string
}