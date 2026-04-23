'use client'
// =============================================================================
// Navbar.tsx — Barre de navigation principale
// =============================================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const navLinks = [
  { href: '/',           label: 'Accueil' },
  { href: '/predict',    label: 'Prédiction' },
  { href: '/analyse',    label: 'Analyse CSV' },
  { href: '/comparateur', label: 'Comparateur' },
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/historique', label: 'Historique' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{
      background: 'rgba(10, 10, 15, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 32px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo + Nom */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={32} />
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 17,
            color: 'var(--text)',
            letterSpacing: '-0.02em'
          }}>
            
            FakeBill <span style={{ color: 'var(--accent)', fontWeight: 400 }}>Detector</span>
          </span>
        </Link>

        {/* Liens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--text2)',
                  background: isActive ? 'rgba(108, 99, 255, 0.12)' : 'transparent',
                  transition: 'all 0.15s ease',
                  fontFamily: isActive ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Badge API status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          background: 'rgba(0, 212, 170, 0.1)',
          border: '1px solid rgba(0, 212, 170, 0.2)',
          borderRadius: 100,
          fontSize: 12,
          color: 'var(--genuine)',
        }}>
          <span style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--genuine)',
            display: 'inline-block',
            animation: 'pulse-glow 2s infinite'
          }} />
          API Live
        </div>
      </div>
    </nav>
  )
}