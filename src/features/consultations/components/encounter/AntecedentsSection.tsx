import { Divider, Stack, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import {
  useAntecedentsByPatient,
  MOCK_FAMILY_ANTECEDENTS,
  MOCK_PERSONAL_ANTECEDENTS,
  MOCK_SURGICAL_ANTECEDENTS,
} from '@/features/antecedents'
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
// Mientras no haya captura real por categoría se muestra el diseño con datos
// de ejemplo (mismo criterio que lifestyle-mock.ts).
export function AntecedentsSection({ index, patientId, readOnly }: AntecedentsSectionProps) {
  const { data: antecedents = [], isLoading, isError, error } = useAntecedentsByPatient(patientId)

  const familyReal = antecedents.filter((a) => a.type === 'family')
  const personalReal = antecedents.filter((a) => a.type === 'personal' || a.type === 'other')
  const surgicalReal = antecedents.filter((a) => a.type === 'surgery' || a.type === 'hospitalization')

  const family = familyReal.length > 0 ? familyReal : MOCK_FAMILY_ANTECEDENTS
  const personal = personalReal.length > 0 ? personalReal : MOCK_PERSONAL_ANTECEDENTS
  const surgical = surgicalReal.length > 0 ? surgicalReal : MOCK_SURGICAL_ANTECEDENTS

  return (
    <CollapsibleSection
      title={`${index}. Antecedentes`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {family.length + personal.length + surgical.length} registrados
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
