'use client'
// =============================================================================
// StatsKPI.tsx — Compteurs KPI animés
// =============================================================================

import { useEffect, useState } from 'react'

interface KPIProps {
  value: number
  label: string
  suffix?: string
  color?: string
  decimals?: number
}

function AnimatedNumber({ value, decimals = 0 }: { value: number, decimals?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(current + increment, value)
      setDisplay(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}</>
}

export function KPICard({ value, label, suffix = '', color = 'var(--accent)', decimals = 0 }: KPIProps) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 36,
        fontWeight: 800,
        color,
        lineHeight: 1,
        marginBottom: 8,
      }}>
        <AnimatedNumber value={value} decimals={decimals} />{suffix}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</div>
    </div>
  )
}

export default function StatsKPI({
  total, genuine, fake, rate
}: {
  total: number
  genuine: number
  fake: number
  rate: number
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <KPICard value={total} label="Billets analysés" color="var(--accent)" />
      <KPICard value={genuine} label="Vrais billets" color="var(--genuine)" />
      <KPICard value={fake} label="Faux billets" color="var(--fake)" />
      <KPICard value={rate * 100} label="Taux d'authenticité" suffix="%" color="var(--accent2)" decimals={1} />
    </div>
  )
}