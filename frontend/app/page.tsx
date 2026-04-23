'use client'
// =============================================================================
// page.tsx — Page d'accueil
// =============================================================================

import Link from 'next/link'
import Logo from '@/components/Logo'

const features = [
  {
    icon: '🎯',
    title: 'Prédiction unitaire',
    desc: 'Saisissez les 6 mesures géométriques d\'un billet et obtenez une prédiction instantanée avec score de confiance.',
    href: '/predict',
    color: '#6c63ff',
  },
  {
    icon: '📊',
    title: 'Analyse CSV',
    desc: 'Uploadez un fichier CSV pour analyser des centaines de billets en une seule requête.',
    href: '/analyse',
    color: '#00d4aa',
  },
  {
    icon: '⚖️',
    title: 'Comparateur de modèles',
    desc: 'Comparez les résultats des 4 algorithmes ML (LR, KNN, RF, KMeans) sur un même billet.',
    href: '/comparateur',
    color: '#ff9f43',
  },
  {
    icon: '📈',
    title: 'Dashboard',
    desc: 'Visualisez les performances des modèles, métriques et statistiques globales.',
    href: '/dashboard',
    color: '#ff4d6d',
  },
]

const models = [
  { name: 'Random Forest', f1: '99.25%', badge: '⭐ Meilleur', color: '#ff9f43' },
  { name: 'KNN', f1: '99.00%', badge: 'Supervisé', color: '#6c63ff' },
  { name: 'Logistic Reg.', f1: '98.99%', badge: 'Supervisé', color: '#00d4aa' },
  { name: 'K-Means', f1: '99.00%', badge: 'Non supervisé', color: '#ff4d6d' },
]

export default function HomePage() {
  return (
    <div style={{ animation: 'fadeUp 0.5s ease' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 0 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Logo size={72} />
        </div>
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 20,
          background: 'linear-gradient(135deg, #e8e8f0 0%, #6c63ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Détection automatique<br />de faux billets
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text2)',
          maxWidth: 580,
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Plateforme ML de détection de contrefaçons en euros basée sur
          l'analyse de 6 mesures géométriques avec 4 algorithmes comparés.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/predict" className="btn-primary">
            Tester un billet →
          </Link>
          <Link href="/analyse" style={{
            padding: '12px 28px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: 14,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            background: 'transparent',
            transition: 'all 0.2s',
          }}>
            Analyser un CSV
          </Link>
        </div>
      </div>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 64 }}>
        {models.map((m) => (
          <div key={m.name} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>
              {m.f1}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{m.name}</div>
            <div style={{
              fontSize: 11,
              color: m.color,
              background: `${m.color}18`,
              border: `1px solid ${m.color}30`,
              borderRadius: 100,
              padding: '2px 8px',
              display: 'inline-block',
            }}>{m.badge}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>Fonctionnalités</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Tout ce dont vous avez besoin pour analyser des billets</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {features.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{
                  fontSize: 17,
                  fontFamily: 'Syne, sans-serif',
                  color: f.color,
                  marginBottom: 8,
                }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stack technique */}
      <div className="card" style={{ background: 'var(--bg3)' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Stack technique</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Python 3.12', 'FastAPI', 'Scikit-learn', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Railway'].map(tech => (
            <span key={tech} style={{
              padding: '6px 14px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--text)',
            }}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  )
}