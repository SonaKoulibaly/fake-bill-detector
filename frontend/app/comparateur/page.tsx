'use client'
// =============================================================================
// comparateur/page.tsx — Comparateur des 4 modèles
// =============================================================================

import { useState } from 'react'
import ModelChart from '@/components/ModelChart'
import { compareModels } from '@/lib/api'
import { BilletInput, ModelCompareResponse } from '@/lib/types'
import { getModelName, getModelColor, formatConfidence } from '@/lib/utils'

const DEFAULT_VALUES: BilletInput = {
  diagonal: 171.81, height_left: 104.86, height_right: 104.95,
  margin_low: 4.52, margin_up: 2.89, length: 112.83
}

const FIELDS: { key: keyof BilletInput; label: string }[] = [
  { key: 'diagonal',     label: 'Diagonale' },
  { key: 'height_left',  label: 'Hauteur gauche' },
  { key: 'height_right', label: 'Hauteur droite' },
  { key: 'margin_low',   label: 'Marge basse' },
  { key: 'margin_up',    label: 'Marge haute' },
  { key: 'length',       label: 'Longueur' },
]

export default function ComparateurPage() {
  const [values, setValues] = useState<BilletInput>(DEFAULT_VALUES)
  const [result, setResult] = useState<ModelCompareResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await compareModels(values)
      setResult(res)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Erreur API')
    } finally {
      setLoading(false)
    }
  }

  const chartData = result ? Object.entries(result.results)
    .filter(([, v]) => v.confidence !== null)
    .map(([modelId, v]) => ({
      model: getModelName(modelId as any).split(' ')[0],
      confidence: v.confidence as number,
      color: getModelColor(modelId as any),
    })) : []

  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>
      <h1 style={{ fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
        Comparateur de modèles
      </h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40 }}>
        Soumettez un billet et comparez les prédictions des 4 algorithmes ML en temps réel.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 32 }}>
        {/* Formulaire */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 16 }}>Mesures (mm)</h3>
            {FIELDS.map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                  {label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={values[key]}
                  onChange={(e) => setValues(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Comparaison...' : 'Comparer les 4 modèles →'}
          </button>
        </div>

        {/* Résultats */}
        <div>
          {error && (
            <div style={{
              padding: 16, borderRadius: 12,
              background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
              color: 'var(--fake)', fontSize: 14, marginBottom: 16,
            }}>⚠️ {error}</div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{
                width: 48, height: 48, margin: '0 auto 16px',
                border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: 'var(--text2)' }}>Interrogation des 4 modèles...</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              {/* Cartes des 4 modèles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {Object.entries(result.results).map(([modelId, res]) => {
                  const color = getModelColor(modelId as any)
                  const bgColor = res.is_genuine ? 'rgba(0,212,170,0.08)' : 'rgba(255,77,109,0.08)'
                  const borderColor = res.is_genuine ? 'rgba(0,212,170,0.25)' : 'rgba(255,77,109,0.25)'
                  return (
                    <div key={modelId} style={{
                      background: bgColor, border: `1px solid ${borderColor}`,
                      borderRadius: 12, padding: 16,
                    }}>
                      <div style={{ fontSize: 12, color, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {getModelName(modelId as any)}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: res.is_genuine ? 'var(--genuine)' : 'var(--fake)', marginBottom: 8 }}>
                        {res.label}
                      </div>
                      {res.confidence !== null && (
                        <div>
                          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
                            Confiance : <strong style={{ color: 'var(--text)' }}>{formatConfidence(res.confidence)}</strong>
                          </div>
                          <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: `${(res.confidence || 0) * 100}%`,
                              background: color, borderRadius: 100,
                            }} />
                          </div>
                        </div>
                      )}
                      {res.confidence === null && (
                        <div style={{ fontSize: 12, color: 'var(--text2)' }}>Pas de score (clustering)</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Graphique */}
              {chartData.length > 0 && (
                <div className="card">
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 20 }}>
                    Score de confiance par modèle
                  </h3>
                  <ModelChart data={chartData} />
                </div>
              )}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="card" style={{ textAlign: 'center', padding: 48, borderStyle: 'dashed' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚖️</div>
              <p style={{ color: 'var(--text2)', fontSize: 14 }}>
                Les résultats des 4 modèles apparaîtront ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}