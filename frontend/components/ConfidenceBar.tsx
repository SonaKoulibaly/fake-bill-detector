'use client'
// =============================================================================
// ConfidenceBar.tsx — Barre de score de confiance animée
// =============================================================================

import { formatConfidence } from '@/lib/utils'

interface Props {
  confidence: number | null
  isGenuine: boolean
}

export default function ConfidenceBar({ confidence, isGenuine }: Props) {
  if (confidence === null) {
    return (
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>
        Score de confiance non disponible (K-Means)
      </div>
    )
  }

  const pct = confidence * 100
  const color = isGenuine ? 'var(--genuine)' : 'var(--fake)'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text2)' }}>Score de confiance</span>
        <span style={{ fontSize: 14, fontWeight: 600, color }}>{formatConfidence(confidence)}</span>
      </div>
      <div style={{
        height: 8,
        background: 'var(--bg3)',
        borderRadius: 100,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 100,
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 12px ${color}60`,
        }} />
      </div>
    </div>
  )
}