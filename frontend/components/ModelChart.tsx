'use client'
// =============================================================================
// ModelChart.tsx — Graphique de comparaison des modèles
// =============================================================================

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

interface Props {
  data: { model: string; confidence: number; color: string }[]
}

export default function ModelChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="model"
          tick={{ fill: 'var(--text2)', fontSize: 12, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: 'var(--text2)', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text)',
            fontFamily: 'DM Sans',
            fontSize: 13,
          }}
          formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Confiance']}
          cursor={{ fill: 'rgba(108,99,255,0.05)' }}
        />
        <Bar dataKey="confidence" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}