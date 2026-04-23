'use client'
// =============================================================================
// analyse/page.tsx — Analyse CSV
// =============================================================================

import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import StatsKPI from '@/components/StatsKPI'
import { predictCSV } from '@/lib/api'
import type { CSVPredictionResponse, ModelId } from '@/lib/types'
import { formatConfidence } from '@/lib/utils'

const MODELS: { id: ModelId; label: string }[] = [
  { id: 'random_forest',       label: 'Random Forest ⭐' },
  { id: 'logistic_regression', label: 'Régression Logistique' },
  { id: 'knn',                 label: 'KNN' },
  { id: 'kmeans',              label: 'K-Means' },
]

export default function AnalysePage() {
  const [model, setModel] = useState<ModelId>('random_forest')
  const [result, setResult] = useState<CSVPredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'genuine' | 'fake'>('all')

  const handleFile = async (file: File) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await predictCSV(file, model)
      setResult(res)

      // Sauvegarde dans l'historique
      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'csv',
        model: model,
        result: `${res.genuine_count} vrais / ${res.fake_count} faux`,
        confidence: res.genuine_rate,
        isGenuine: res.genuine_count > res.fake_count,
        total: res.total,
      }
      const existing = JSON.parse(localStorage.getItem('billguard_history') || '[]')
      localStorage.setItem('billguard_history', JSON.stringify([entry, ...existing]))

    } catch (e: any) {
      setError(e?.response?.data?.detail || "Erreur lors de l'analyse")
    } finally {
      setLoading(false)
    }
  }

  const filtered = result?.predictions.filter(p => {
    const matchFilter = filter === 'all' || (filter === 'genuine' ? p.is_genuine : !p.is_genuine)
    return matchFilter
  }) || []

  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>
      <h1 style={{ fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
        Analyse CSV
      </h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40 }}>
        Uploadez un fichier CSV pour analyser plusieurs billets en une seule opération.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Choix modèle */}
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 14 }}>Modèle</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setModel(m.id)} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                border: `1px solid ${model === m.id ? 'var(--accent)' : 'var(--border)'}`,
                background: model === m.id ? 'rgba(108,99,255,0.12)' : 'transparent',
                color: model === m.id ? 'var(--accent)' : 'var(--text2)',
                transition: 'all 0.15s',
              }}>{m.label}</button>
            ))}
          </div>
        </div>

        {/* Format attendu */}
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 10 }}>Format CSV attendu</h3>
          <code style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'monospace', lineHeight: 1.8 }}>
            diagonal;height_left;height_right<br />
            margin_low;margin_up;length
          </code>
        </div>
      </div>

      {/* Zone upload */}
      <div style={{ marginBottom: 32 }}>
        <UploadZone onFile={handleFile} loading={loading} />
      </div>

      {error && (
        <div style={{
          padding: 16, borderRadius: 12, marginBottom: 24,
          background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
          color: 'var(--fake)', fontSize: 14,
        }}>⚠️ {error}</div>
      )}

      {/* Résultats */}
      {result && (
        <div style={{ animation: 'fadeUp 0.4s ease' }}>
          <StatsKPI
            total={result.total}
            genuine={result.genuine_count}
            fake={result.fake_count}
            rate={result.genuine_rate}
          />

          {/* Tableau */}
          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16 }}>
                Résultats détaillés ({result.total} billets)
              </h3>
              {/* Filtres */}
              <div style={{ display: 'flex', gap: 8 }}>
                {(['all', 'genuine', 'fake'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                    background: filter === f ? 'rgba(108,99,255,0.12)' : 'transparent',
                    color: filter === f ? 'var(--accent)' : 'var(--text2)',
                  }}>
                    {f === 'all' ? 'Tous' : f === 'genuine' ? '✅ Vrais' : '❌ Faux'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Résultat', 'Score de confiance', 'Barre'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '10px 12px',
                        color: 'var(--text2)', fontWeight: 500, fontSize: 12,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 50).map((p) => (
                    <tr key={p.index} style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.1s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{p.index + 1}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={p.is_genuine ? 'badge-genuine' : 'badge-fake'}>
                          {p.label}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text)' }}>
                        {formatConfidence(p.confidence)}
                      </td>
                      <td style={{ padding: '10px 12px', minWidth: 120 }}>
                        {p.confidence !== null && (
                          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${p.confidence * 100}%`,
                              background: p.is_genuine ? 'var(--genuine)' : 'var(--fake)',
                              borderRadius: 100,
                            }} />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length > 50 && (
                <p style={{ textAlign: 'center', padding: 16, color: 'var(--text2)', fontSize: 13 }}>
                  Affichage des 50 premiers résultats sur {filtered.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}