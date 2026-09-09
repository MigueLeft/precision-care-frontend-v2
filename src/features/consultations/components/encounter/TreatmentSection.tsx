import { Box, Chip, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import {
  useConsultationMedications,
  useAddConsultationMedication,
  useCaptureConsultationMedication,
} from '../../hooks/useConsultationMedications'
import { MedicationHistory } from './MedicationHistory'
import { MedicationAddForm } from './MedicationAddForm'
import { TreatmentMedicationRow } from './TreatmentMedicationRow'
import type { Consultation, ConsultationMedication, VisitType } from '../../types'

interface TreatmentSectionProps {
  index: number
  consultation: Consultation
  readOnly: boolean
}

function medname(m: ConsultationMedication) {
  const base = m.brandName ?? m.genericName ?? 'Medicamento'
  return m.concentration ? `${base} ${m.concentration}` : base
}

export function TreatmentSection({ index, consultation, readOnly }: TreatmentSectionProps) {
  const consultationId = consultation.id
  const visitType = consultation.visitType

  const update = useUpdateConsultation(consultationId)
  const { data: medications = [] } = useConsultationMedications(consultationId)
  const addMutation = useAddConsultationMedication(consultationId)
  const captureMutation = useCaptureConsultationMedication(consultationId)

  const isSubsequent = visitType === 'subsequent'

  return (
    <CollapsibleSection
      title={`${index}. Tratamiento actual`}
      headerMeta={
        <Chip
          size="small"
          color={isSubsequent ? 'default' : 'warning'}
          label={isSubsequent ? 'Subsecuente' : 'Primera consulta'}
        />
      }
      defaultExpanded
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap' }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Tipo de consulta</Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={visitType}
          onChange={(_e, value: VisitType | null) => {
            if (value && value !== visitType) update.mutate({ visitType: value })
          }}
          disabled={readOnly || update.isPending}
        >
          <ToggleButton value="first">Primera consulta</ToggleButton>
          <ToggleButton value="subsequent">Subsecuente</ToggleButton>
        </ToggleButtonGroup>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic' }}>
          Define si se captura adherencia o si se registra el tratamiento base del paciente.
        </Typography>
      </Stack>

      {isSubsequent && <MedicationHistory consultationId={consultationId} />}

      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main' }}>
          {isSubsequent
            ? `CAPTURA DE ESTA CONSULTA · ${formatShortDate(consultation.startAt)}`
            : 'MEDICAMENTOS DEL PACIENTE'}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {medications.length} registrados
        </Typography>
      </Stack>

      {medications.length === 0 && (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
          Aún no has añadido medicamentos al expediente del paciente.
        </Typography>
      )}

      <Stack spacing={1} sx={{ my: 1 }}>
        {isSubsequent
          ? medications.map((medication) => (
              <TreatmentMedicationRow
                key={medication.id}
                medication={medication}
                readOnly={readOnly}
                isSaving={captureMutation.isPending}
                onSave={(input) =>
                  captureMutation.mutate({ medicationId: medication.id, input })
                }
              />
            ))
          : medications.map((medication) => (
              <Box
                key={medication.id}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 1.5, py: 1 }}
              >
                <Typography sx={{ fontSize: '14px' }}>
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    {medname(medication)}
                  </Box>
                  <Box component="span" sx={{ color: 'text.secondary' }}>
                    {medication.dose ? `  ${medication.dose}` : ''}
                    {medication.frequency ? `  ${medication.frequency}` : ''}
                  </Box>
                </Typography>
              </Box>
            ))}
      </Stack>

      {!readOnly && (
        <MedicationAddForm onAdd={addMutation.mutate} isAdding={addMutation.isPending} />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Los medicamentos añadidos se guardan en el expediente, no como prescripción de esta consulta.
      </Typography>
    </CollapsibleSection>
  )
}
