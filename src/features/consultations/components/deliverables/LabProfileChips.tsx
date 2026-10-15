import { Chip, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import type { LabProfile } from '@/features/catalogs'

type LabProfileChipsProps = {
  profiles: LabProfile[]
  selected: number[]
  readOnly: boolean
  onToggle: (profile: LabProfile) => void
}

// Perfiles de laboratorio como selección: al marcar uno se agregan sus
// estudios y al desmarcarlo se quitan.
export function LabProfileChips({ profiles, selected, readOnly, onToggle }: LabProfileChipsProps) {
  const visible = profiles.filter((profile) => profile.active || selected.includes(profile.id))
  if (visible.length === 0) return null
  return (
    <Stack spacing={0.75}>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>
        Perfiles · {selected.length} seleccionado{selected.length === 1 ? '' : 's'}
      </Typography>
      <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }}>
        {visible.map((profile) => {
          const isSelected = selected.includes(profile.id)
          return (
            <Chip
              key={profile.id}
              label={`${profile.name} (${profile.items.length})`}
              icon={isSelected ? <CheckIcon sx={{ fontSize: 16 }} /> : undefined}
              onClick={readOnly ? undefined : () => onToggle(profile)}
              variant={isSelected ? 'filled' : 'outlined'}
              color="primary"
            />
          )
        })}
      </Stack>
    </Stack>
  )
}
