import { Divider, Stack, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useAntecedentsByPatient } from '@/features/antecedents'
import { FamilyAntecedentsBlock } from './FamilyAntecedentsBlock'
import { PersonalAntecedentsBlock } from './PersonalAntecedentsBlock'
import { SurgicalAntecedentsBlock } from './SurgicalAntecedentsBlock'

interface AntecedentsSectionProps {
  index: number
  patientId: number
  readOnly: boolean
}

// Los antecedentes se guardan en el expediente (no por consulta); aquí se
// confirman o actualizan. Sólo estos 3 bloques — sin "no patológicos".
export function AntecedentsSection({ index, patientId, readOnly }: AntecedentsSectionProps) {
  const { data: antecedents = [], isLoading, isError, error } = useAntecedentsByPatient(patientId)

  const family = antecedents.filter((a) => a.type === 'family')
  const personal = antecedents.filter((a) => a.type === 'personal' || a.type === 'other')
  const surgical = antecedents.filter((a) => a.type === 'surgery' || a.type === 'hospitalization')

  return (
    <CollapsibleSection
      title={`${index}. Antecedentes`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {antecedents.length} registrados
        </Typography>
      }
      defaultExpanded
    >
      {isLoading || isError ? (
        <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
          {null}
        </QueryBoundary>
      ) : (
        <Stack spacing={2.5} divider={<Divider />}>
          <FamilyAntecedentsBlock patientId={patientId} antecedents={family} readOnly={readOnly} />
          <PersonalAntecedentsBlock patientId={patientId} antecedents={personal} readOnly={readOnly} />
          <SurgicalAntecedentsBlock patientId={patientId} antecedents={surgical} readOnly={readOnly} />
        </Stack>
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
        Los antecedentes se guardan en el expediente, no sólo en esta consulta.
      </Typography>
    </CollapsibleSection>
  )
}
