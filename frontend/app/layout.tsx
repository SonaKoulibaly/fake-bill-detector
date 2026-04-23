// =============================================================================
// layout.tsx — Layout global Next.js 14
// =============================================================================

import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'FakeBill Detector — Détection de faux billets',
  description: 'Plateforme de détection automatique de faux billets en euros par Machine Learning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 32px' }}>
            {children}
          </main>
          <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '20px 32px',
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text2)',
          }}>
            © 2026 —  FakeBill Detector · Sona KOULIBALY · Python 3.12 + FastAPI + Next.js 14
            
          </footer>
        </div>
      </body>
    </html>
  )
}