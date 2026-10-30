import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'

function elapsed(from: string): string {
  const ms = Date.now() - new Date(from).getTime()
  const mins = Math.max(0, Math.floor(ms / 60000))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Tiempo transcurrido de la consulta en curso (se actualiza cada 30 s).
export function EncounterDuration({ startAt }: { startAt: string }) {
  const [duration, setDuration] = useState(() => elapsed(startAt))

  useEffect(() => {
    const timer = setInterval(() => setDuration(elapsed(startAt)), 30000)
    return () => clearInterval(timer)
  }, [startAt])

  return (
    <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Duración {duration}</Typography>
  )
}
