import { Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useAntecedentsByPatient } from '@/features/antecedents'
import { useConsultationAllergies } from '../../hooks/useConsultationAllergies'
import { AntecedentBlocks } from './AntecedentBlocks'

interface AntecedentsSectionProps {
  index: number
  patientId: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

// Los antecedentes (y alergias) se guardan en el expediente, no por consulta;
// aquí se confirman o actualizan.
export function AntecedentsSection({
  index,
  patientId,
  consultationId,
  consultationDate,
  readOnly,
}: AntecedentsSectionProps) {
  const { data: antecedents = [] } = useAntecedentsByPatient(patientId)
  const { data: allergyData } = useConsultationAllergies(consultationId)
  const total = antecedents.length + (allergyData?.allergies.length ?? 0)

  return (
    <CollapsibleSection
      title={`${index}. Antecedentes`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {total} registrados
        </Typography>
      }
      defaultExpanded
    >
      <AntecedentBlocks
        patientId={patientId}
        consultationId={consultationId}
        consultationDate={consultationDate}
        readOnly={readOnly}
      />

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
        Los antecedentes y alergias se guardan en el expediente, no sólo en esta consulta.
      </Typography>
    </CollapsibleSection>
  )
}
