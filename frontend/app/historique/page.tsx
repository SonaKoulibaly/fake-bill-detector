'use client'
// =============================================================================
// historique/page.tsx — Historique des prédictions (localStorage)
// =============================================================================

import { useEffect, useState } from 'react'
import { formatConfidence } from '@/lib/utils'

interface HistoryEntry {
  id: string
  date: string
  type: 'single' | 'csv'
  model: string
  result: string
  confidence: number | null
  isGenuine: boolean
  total?: number
}

export default function HistoriquePage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    // Chargement de l'historique depuis localStorage
    try {
      const saved = localStorage.getItem('billguard_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  const clearHistory = () => {
    localStorage.removeItem('billguard_history')
    setHistory([])
  }

  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>Historique</h1>
          <p style={{ color: 'var(--text2)' }}>
            Toutes vos prédictions de la session en cours.
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
            border: '1px solid rgba(255,77,109,0.3)',
            background: 'rgba(255,77,109,0.08)',
            color: 'var(--fake)',
          }}>
            Vider l'historique
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 40px', borderStyle: 'dashed' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>Aucune prédiction</h3>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            Les prédictions que vous effectuez depuis les pages Prédiction et Analyse CSV apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Date', 'Type', 'Modèle', 'Résultat', 'Confiance'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px',
                    color: 'var(--text2)', fontWeight: 500, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>
                    {new Date(entry.date).toLocaleString('fr-FR')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 100,
                      background: 'rgba(108,99,255,0.12)', color: 'var(--accent)',
                    }}>
                      {entry.type === 'csv' ? `CSV (${entry.total})` : 'Unitaire'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>
                    {entry.model}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={entry.isGenuine ? 'badge-genuine' : 'badge-fake'}>
                      {entry.result}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>
                    {formatConfidence(entry.confidence)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}