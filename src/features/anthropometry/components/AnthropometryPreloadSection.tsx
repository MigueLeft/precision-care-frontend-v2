import { Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import {
  useAnthropometriesByPatient,
  useAnthropometryByAppointment,
  useSaveAnthropometry,
} from '../hooks/useAnthropometry'
import { sortAnthropometries } from '../utils/anthropometry-calculations'
import { historyColumns } from '../utils/history-columns'
import { AnthropometryForm } from './AnthropometryForm'

type AnthropometryPreloadSectionProps = {
  index: number
  appointmentId: number
  patientId: number
}

// Antropometría precargada desde la cita: al iniciar la consulta se convierte
// en la captura de esa consulta.
export function AnthropometryPreloadSection({
  index,
  appointmentId,
  patientId,
}: AnthropometryPreloadSectionProps) {
  const { data: all = [] } = useAnthropometriesByPatient(patientId)
  const { data: existing, isLoading } = useAnthropometryByAppointment(appointmentId)
  const save = useSaveAnthropometry(existing?.id)
  const previous = sortAnthropometries(all.filter((row) => row.id !== existing?.id))

  return (
    <CollapsibleSection title={`${index}. Antropometría`} defaultExpanded>
      <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1.5 }}>
        Se carga como la medición de la consulta en cuanto el especialista la inicie.
      </Typography>
      {!isLoading && (
        <AnthropometryForm
          key={existing?.id ?? 'new'}
          patientId={patientId}
          appointmentId={appointmentId}
          existing={existing}
          history={historyColumns(previous)}
          isSaving={save.isPending}
          onSave={save.mutate}
        />
      )}
    </CollapsibleSection>
  )
}
