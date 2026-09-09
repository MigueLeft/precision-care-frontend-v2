import { useTheme } from '@mui/material'
import type { BodySegment } from '../types'

interface BodyFigureProps {
  selected: BodySegment
  onSelect: (segment: BodySegment) => void
}

// Esquema simple del cuerpo humano: cada parte selecciona su segmento.
const PARTS: { segment: Exclude<BodySegment, 'total'>; label: string; rect: [number, number, number, number] }[] = [
  { segment: 'torso', label: 'Torso', rect: [40, 42, 40, 55] },
  { segment: 'left_arm', label: 'B. izq', rect: [82, 44, 16, 48] },
  { segment: 'right_arm', label: 'B. der', rect: [22, 44, 16, 48] },
  { segment: 'left_leg', label: 'P. izq', rect: [61, 100, 17, 55] },
  { segment: 'right_leg', label: 'P. der', rect: [42, 100, 17, 55] },
]

export function BodyFigure({ selected, onSelect }: BodyFigureProps) {
  const theme = useTheme()
  const base = theme.palette.grey[300]
  const active = theme.palette.primary.main

  return (
    <svg viewBox="0 0 120 165" width="100%" style={{ maxWidth: 200 }} role="img" aria-label="Esquema corporal">
      {/* Cabeza (no seleccionable) */}
      <circle cx={60} cy={22} r={13} fill={base} />
      {PARTS.map((part) => {
        const isActive = selected === part.segment
        const [x, y, w, h] = part.rect
        return (
          <g
            key={part.segment}
            onClick={() => onSelect(part.segment)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={7}
              fill={isActive ? active : base}
            />
            <text
              x={x + w / 2}
              y={y + h / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={6}
              fill={isActive ? '#fff' : theme.palette.text.secondary}
            >
              {part.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
