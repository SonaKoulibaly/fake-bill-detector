'use client'
// =============================================================================
// dashboard/page.tsx — Dashboard performances des modèles
// =============================================================================

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts'

// Données statiques des performances (issues du notebook)
const METRICS = [
  { model: 'Logistic Reg.', accuracy: 0.9867, f1: 0.9899, precision: 0.9949, recall: 0.9850, auc: 0.9995, color: '#6c63ff' },
  { model: 'KNN',           accuracy: 0.9867, f1: 0.9900, precision: 0.9851, recall: 0.9950, auc: 0.9994, color: '#00d4aa' },
  { model: 'Random Forest', accuracy: 0.9900, f1: 0.9925, precision: 0.9900, recall: 0.9950, auc: 0.9992, color: '#ff9f43' },
  { model: 'K-Means',       accuracy: 0.9867, f1: 0.9900, precision: 0.9900, recall: 0.9900, auc: null,   color: '#ff4d6d' },
]

const radarData = [
  { metric: 'Accuracy',  LR: 98.67, KNN: 98.67, RF: 99.00, KM: 98.67 },
  { metric: 'F1-Score',  LR: 98.99, KNN: 99.00, RF: 99.25, KM: 99.00 },
  { metric: 'Précision', LR: 99.49, KNN: 98.51, RF: 99.00, KM: 99.00 },
  { metric: 'Rappel',    LR: 98.50, KNN: 99.50, RF: 99.50, KM: 99.00 },
]

const barData = METRICS.map(m => ({
  name: m.model,
  Accuracy: +(m.accuracy * 100).toFixed(2),
  'F1-Score': +(m.f1 * 100).toFixed(2),
  AUC: m.auc ? +(m.auc * 100).toFixed(2) : null,
}))

const tooltipStyle = {
  contentStyle: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontFamily: 'DM Sans', fontSize: 13,
  }
}

export default function DashboardPage() {
  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>
      <h1 style={{ fontSize: 32, fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40 }}>
        Performances des 4 modèles ML sur le jeu de test (20% du dataset — 300 billets).
      </p>

      {/* Tableau des métriques */}
      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, marginBottom: 20 }}>
          Tableau comparatif des métriques
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Modèle', 'Type', 'Accuracy', 'F1-Score', 'Précision', 'Rappel', 'AUC-ROC'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px',
                    color: 'var(--text2)', fontWeight: 500, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m, i) => (
                <tr key={m.model} style={{
                  borderBottom: '1px solid var(--border)',
                  background: i === 2 ? 'rgba(255,159,67,0.04)' : 'transparent',
                }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: m.color }} />
                      <span style={{ fontWeight: i === 2 ? 600 : 400 }}>{m.model}</span>
                      {i === 2 && <span style={{ fontSize: 11, color: '#ff9f43' }}>⭐</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 100,
                      background: m.auc ? 'rgba(108,99,255,0.12)' : 'rgba(255,77,109,0.12)',
                      color: m.auc ? 'var(--accent)' : 'var(--fake)',
                    }}>
                      {m.auc ? 'supervisé' : 'non supervisé'}
                    </span>
                  </td>
                  {[m.accuracy, m.f1, m.precision, m.recall].map((v, j) => (
                    <td key={j} style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text)' }}>
                      {(v * 100).toFixed(2)}%
                    </td>
                  ))}
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text)' }}>
                    {m.auc ? `${(m.auc * 100).toFixed(2)}%` : <span style={{ color: 'var(--text2)' }}>N/A</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Barres */}
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 20 }}>
            Accuracy & F1-Score (%)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[98, 100]} tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
              <Bar dataKey="Accuracy" fill="#6c63ff" radius={[4,4,0,0]} fillOpacity={0.8} />
              <Bar dataKey="F1-Score" fill="#00d4aa" radius={[4,4,0,0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 20 }}>
            Vue radar — Métriques (%)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
              <Radar name="Random Forest" dataKey="RF" stroke="#ff9f43" fill="#ff9f43" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="KNN" dataKey="KNN" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="LR" dataKey="LR" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.1} strokeWidth={1.5} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info dataset */}
      <div className="card" style={{ marginTop: 24, background: 'var(--bg3)' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, marginBottom: 14 }}>Dataset</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total billets', value: '1 500' },
            { label: 'Vrais billets', value: '1 000' },
            { label: 'Faux billets', value: '500' },
            { label: 'Features', value: '6 mesures géométriques' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: 'var(--accent)', marginBottom: 4 }}>
                {item.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}