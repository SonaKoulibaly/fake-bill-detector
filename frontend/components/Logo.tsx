// =============================================================================
// Logo.tsx — Logo SVG custom du projet
// =============================================================================

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fond */}
      <rect width="40" height="40" rx="10" fill="#6c63ff" />
      {/* Billet stylisé */}
      <rect x="7" y="13" width="26" height="14" rx="3" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" />
      {/* Cercle central (valeur) */}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.9" />
      {/* Lignes décoratives gauche */}
      <line x1="10" y1="17" x2="14" y2="17" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="20" x2="13" y2="20" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="23" x2="14" y2="23" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      {/* Lignes décoratives droite */}
      <line x1="26" y1="17" x2="30" y2="17" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="20" x2="30" y2="20" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="26" y1="23" x2="30" y2="23" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      {/* Tick de validation */}
      <path d="M17.5 20L19.5 22L22.5 18" stroke="#00d4aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}