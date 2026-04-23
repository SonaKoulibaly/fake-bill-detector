// =============================================================================
// utils.ts — Fonctions utilitaires partagées
// =============================================================================

import { ModelId } from './types'

/** Formate un score de confiance en pourcentage lisible */
export function formatConfidence(confidence: number | null): string {
  if (confidence === null) return 'N/A'
  return `${(confidence * 100).toFixed(1)}%`
}

/** Retourne le nom lisible d'un modèle */
export function getModelName(modelId: ModelId): string {
  const names: Record<ModelId, string> = {
    logistic_regression: 'Régression Logistique',
    knn: 'K-Nearest Neighbors',
    random_forest: 'Random Forest',
    kmeans: 'K-Means'
  }
  return names[modelId] || modelId
}

/** Retourne la couleur CSS associée à un modèle */
export function getModelColor(modelId: ModelId): string {
  const colors: Record<ModelId, string> = {
    logistic_regression: '#6c63ff',
    knn: '#00d4aa',
    random_forest: '#ff9f43',
    kmeans: '#ff4d6d'
  }
  return colors[modelId] || '#8888aa'
}

/** Tronque un texte long */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/** Formate un nombre avec séparateur de milliers */
export function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR')
}