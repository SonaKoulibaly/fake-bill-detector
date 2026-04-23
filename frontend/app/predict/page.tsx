'use client'
// =============================================================================
// predict/page.tsx — Prédiction manuelle d'un billet
// =============================================================================

import { useState } from 'react'
import BilletCard from '@/components/BilletCard'
import { predictOne } from '@/lib/api'
import type { BilletInput, PredictionResult, ModelId } from '@/lib/types'

const FIELDS: { key: keyof BilletInput; label: string; example: number }[] = [
  { key: 'diagonal',     label: 'Diagonale (mm)',       example: 171.81 },
  { key: 'height_left',  label: 'Hauteur gauche (mm)',  example: 104.86 },
  { key: 'height_right', label: 'Hauteur droite (mm)',  example: 104.95 },
  { key: 'margin_low',   label: 'Marge basse (mm)',     example: 4.52   },
  { key: 'margin_up',    label: 'Marge haute (mm)',     example: 2.89   },
  { key: 'length',       label: 'Longueur (mm)',        example: 112.83 },
]

const MODELS: { id: ModelId; label: string }[] = [
  { id: 'random_forest',       label: 'Random Forest ⭐' },
  { id: 'logistic_regression', label: 'Régression Logistique' },
  { id: 'knn',                 label: 'K-Nearest Neighbors' },
  { id: 'kmeans',              label: 'K-Means' },
]

const DEFAULT_VALUES: BilletInput = {
  diagonal: 171.81, height_left: 104.86, height_right: 104.95,
  margin_low: 4.52, margin_up: 2.89, length: 112.83
}

export default function PredictPage() {
  const [values, setValues] = useState<BilletInput>(DEFAULT_VALUES)
  const [model, setModel] = useState<ModelId>('random_forest')
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (key: keyof BilletInput, val: string) => {
    setValues((prev: BilletInput) => ({ ...prev, [key]: parseFloat(val) || 0 }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await predictOne(values, model)
      setResult(res)

      // Sauvegarde dans l'historique localStorage
      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'single',
        model: model,
        result: res.label,
        confidence: res.confidence,
        isGenuine: res.is_genuine,
      }
      const existing = JSON.parse(localStorage.getItem('billguard_history') || '[]')
      localStorage.setItem('billguard_history', JSON.stringify([entry, ...existing]))

    } catch (e: any) {
      setError(e?.response?.data?.detail || "Erreur de connexion à l'API")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setValues(DEFAULT_VALUES)
    setResult(null)
    setError(null)
  }

  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>
      <h1 style={{ fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
        Prédiction manuelle
      </h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40 }}>
        Saisissez les 6 mesures géométriques d'un billet pour obtenir une prédiction instantanée.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* Formulaire */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 20, fontSize: 16 }}>
              Mesures géométriques
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {FIELDS.map((field) => (
                <div key={String(field.key)}>
                  <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={values[field.key]}
                    placeholder={`ex: ${field.example}`}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Choix du modèle */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 16, fontSize: 16 }}>
              Modèle ML
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${model === m.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: model === m.id ? 'rgba(108,99,255,0.12)' : 'var(--bg3)',
                    color: model === m.id ? 'var(--accent)' : 'var(--text2)',
                    fontSize: 13,
                    fontWeight: model === m.id ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Analyse...' : 'Analyser le billet →'}
            </button>
            <button onClick={handleReset} style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text2)',
              cursor: 'pointer',
              fontSize: 14,
            }}>
              Reset
            </button>
          </div>
        </div>

        {/* Résultat */}
        <div>
          {error && (
            <div style={{
              padding: 16, borderRadius: 12,
              background: 'rgba(255,77,109,0.1)',
              border: '1px solid rgba(255,77,109,0.3)',
              color: 'var(--fake)', fontSize: 14,
            }}>
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{
                width: 48, height: 48, margin: '0 auto 16px',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: 'var(--text2)' }}>Analyse en cours...</p>
            </div>
          )}

          {result && !loading && (
            <BilletCard result={result} billetData={values as any} />
          )}

          {!result && !loading && !error && (
            <div className="card" style={{
              textAlign: 'center', padding: 48,
              borderStyle: 'dashed',
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>💶</div>
              <p style={{ color: 'var(--text2)', fontSize: 14 }}>
                Le résultat apparaîtra ici après l'analyse
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}