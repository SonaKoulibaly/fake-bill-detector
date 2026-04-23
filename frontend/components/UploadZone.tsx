'use client'
// =============================================================================
// UploadZone.tsx — Zone de drag & drop pour fichier CSV
// =============================================================================

import { useCallback, useState } from 'react'

interface Props {
  onFile: (file: File) => void
  loading?: boolean
}

export default function UploadZone({ onFile, loading = false }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Veuillez sélectionner un fichier .csv')
      return
    }
    setFileName(file.name)
    onFile(file)
  }, [onFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      style={{
        display: 'block',
        border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: '48px 32px',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        background: dragOver ? 'rgba(108, 99, 255, 0.05)' : 'var(--bg2)',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={loading}
      />

      {loading ? (
        <div>
          <div style={{
            width: 40, height: 40, margin: '0 auto 16px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Analyse en cours...</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          {fileName ? (
            <>
              <p style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>{fileName}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>Cliquer pour changer de fichier</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                Glisser-déposer votre CSV ici
              </p>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>
                ou cliquer pour sélectionner — format .csv uniquement
              </p>
            </>
          )}
        </div>
      )}
    </label>
  )
}