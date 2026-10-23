import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import type { SpecialistLookup } from '@/features/identity'
import { specialistColor } from '../../utils/calendar-colors'

type SpecialistLegendProps = {
  specialists: SpecialistLookup[]
  selectedId: number | ''
  onSelect: (id: number | '') => void
}

// Leyenda de colores por médico (como "Mis calendarios" de Google): un clic
// filtra por ese médico y otro clic quita el filtro.
export function SpecialistLegend({ specialists, selectedId, onSelect }: SpecialistLegendProps) {
  return (
    <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', mb: 1.5 }}>
      {specialists.map((specialist) => {
        const active = selectedId === '' || selectedId === specialist.id
        return (
          <ButtonBase
            key={specialist.id}
            onClick={() => onSelect(selectedId === specialist.id ? '' : specialist.id)}
            sx={{ px: 1, py: 0.5, borderRadius: '16px', gap: 0.75, opacity: active ? 1 : 0.45, '&:hover': { bgcolor: 'action.hover' } }}
          >
            <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: specialistColor(specialist.id) }} />
            <Typography sx={{ fontSize: '12.5px' }}>
              {specialist.name} {specialist.lastName}
            </Typography>
          </ButtonBase>
        )
      })}
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', ml: 1 }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '3px', border: '1px solid', borderColor: 'text.secondary', borderLeftWidth: 3 }} />
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Sin confirmar</Typography>
      </Stack>
    </Stack>
  )
}
