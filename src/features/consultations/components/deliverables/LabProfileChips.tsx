import { Chip, Stack, Typography } from '@mui/material'
import type { LabProfile } from '@/features/catalogs'

type LabProfileChipsProps = {
  profiles: LabProfile[]
  onAdd: (profile: LabProfile) => void
}

// Atajos para agregar todos los estudios de un perfil de laboratorio activo.
export function LabProfileChips({ profiles, onAdd }: LabProfileChipsProps) {
  const active = profiles.filter((profile) => profile.active)
  if (active.length === 0) return null
  return (
    <Stack spacing={0.75}>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>
        Agregar un perfil completo
      </Typography>
      <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }}>
        {active.map((profile) => (
          <Chip
            key={profile.id}
            label={`${profile.name} (${profile.items.length})`}
            onClick={() => onAdd(profile)}
            variant="outlined"
            color="primary"
          />
        ))}
      </Stack>
    </Stack>
  )
}
