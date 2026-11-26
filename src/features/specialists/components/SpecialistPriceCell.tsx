import { Button, Stack, Typography } from '@mui/material'
import { useCan } from '@/features/identity'
import type { Specialist } from '../types'

type Props = { specialist: Specialist; onEdit: (specialist: Specialist) => void }
export function SpecialistPriceCell({ specialist, onEdit }: Props) {
  const { can } = useCan()
  return <Stack sx={{ alignItems: 'flex-start' }}>
    <Typography variant="body2">{specialist.defaultAppointmentPrice == null ? 'Sin precio' : `${specialist.defaultAppointmentPrice.toLocaleString('es-VE', { minimumFractionDigits: 2 })} USD`}</Typography>
    {can('especialistas:update') && <Button size="small" onClick={(event) => { event.stopPropagation(); onEdit(specialist) }}>Ajustar precio</Button>}
  </Stack>
}
