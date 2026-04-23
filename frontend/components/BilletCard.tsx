'use client'
// =============================================================================
// BilletCard.tsx — Carte résultat de prédiction
// =============================================================================

import ConfidenceBar from './ConfidenceBar'
import { PredictionResult } from '@/lib/types'
import { getModelName } from '@/lib/utils'

interface Props {
  result: PredictionResult
  billetData?: Record<string, number>
}

export default function BilletCard({ result, billetData }: Props) {
  const color = result.is_genuine ? 'var(--genuine)' : 'var(--fake)'
  const bgColor = result.is_genuine ? 'rgba(0, 212, 170, 0.08)' : 'rgba(255, 77, 109, 0.08)'
  const borderColor = result.is_genuine ? 'rgba(0, 212, 170, 0.3)' : 'rgba(255, 77, 109, 0.3)'

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 16,
      padding: 28,
      animation: 'fadeUp 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Icône */}
          <div style={{
            width: 48, height: 48,
            borderRadius: 12,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {result.is_genuine ? '✅' : '❌'}
          </div>
          <div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              color,
            }}>
              {result.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
              Modèle : {getModelName(result.model_used as any)}
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className={result.is_genuine ? 'badge-genuine' : 'badge-fake'}>
          {result.is_genuine ? 'AUTHENTIQUE' : 'CONTREFAÇON'}
        </div>
      </div>

      {/* Barre de confiance */}
      <ConfidenceBar confidence={result.confidence} isGenuine={result.is_genuine} />

      {/* Données du billet si fournies */}
      {billetData && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Mesures analysées
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {Object.entries(billetData).map(([key, val]) => (
              <div key={key} style={{
                background: 'var(--bg3)',
                borderRadius: 8,
                padding: '8px 12px',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{key}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{val} mm</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}