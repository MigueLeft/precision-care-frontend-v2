import { Grid } from '@mui/material'
import { StatTile } from '@/components/ui/StatTile'
import type { Specialist } from '../types'

interface Props {
  specialists: Specialist[]
}

export function SpecialistsStats({ specialists }: Props) {
  const total = specialists.length
  const active = specialists.filter((s) => s.active).length
  const withUser = specialists.filter((s) => s.hasUser).length

  const tiles = [
    { label: 'ESPECIALISTAS', value: String(total) },
    { label: 'ACTIVOS', value: String(active) },
    { label: 'CON USUARIO', value: String(withUser) },
    { label: 'SIN USUARIO', value: String(total - withUser) },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {tiles.map((tile) => (
        <Grid key={tile.label} size={{ xs: 6, md: 3 }}>
          <StatTile label={tile.label} value={tile.value} />
        </Grid>
      ))}
    </Grid>
  )
}
