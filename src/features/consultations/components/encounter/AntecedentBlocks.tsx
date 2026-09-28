import { Divider, Stack } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import {
  useAntecedentsByPatient,
  MOCK_FAMILY_ANTECEDENTS,
  MOCK_PERSONAL_ANTECEDENTS,
  MOCK_SURGICAL_ANTECEDENTS,
  type Antecedent,
} from '@/features/antecedents'
import { groupAntecedents } from '../../utils/antecedent-groups'
import { AllergiesBlock } from './AllergiesBlock'
import { FamilyAntecedentsBlock } from './FamilyAntecedentsBlock'
import { PersonalAntecedentsBlock } from './PersonalAntecedentsBlock'
import { SurgicalAntecedentsBlock } from './SurgicalAntecedentsBlock'

type AntecedentBlocksProps = {
  patientId: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
  // Mostrar datos de ejemplo cuando una categoría aún no tiene captura real.
  withExamples?: boolean
}

// Familiares, personales, quirúrgicos/hospitalizaciones y alergias.
export function AntecedentBlocks({
  patientId,
  consultationId,
  consultationDate,
  readOnly,
  withExamples = false,
}: AntecedentBlocksProps) {
  const { data: antecedents = [], isLoading, isError, error } = useAntecedentsByPatient(patientId)

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  const real = groupAntecedents(antecedents)
  const pick = (list: Antecedent[], mock: Antecedent[]) =>
    withExamples && list.length === 0 ? mock : list

  return (
    <Stack spacing={2.5} divider={<Divider />}>
      <FamilyAntecedentsBlock
        patientId={patientId}
        antecedents={pick(real.family, MOCK_FAMILY_ANTECEDENTS)}
        readOnly={readOnly}
      />
      <PersonalAntecedentsBlock
        patientId={patientId}
        antecedents={pick(real.personal, MOCK_PERSONAL_ANTECEDENTS)}
        readOnly={readOnly}
      />
      <SurgicalAntecedentsBlock
        patientId={patientId}
        antecedents={pick(real.surgical, MOCK_SURGICAL_ANTECEDENTS)}
        readOnly={readOnly}
      />
      <AllergiesBlock
        consultationId={consultationId}
        consultationDate={consultationDate}
        readOnly={readOnly}
      />
    </Stack>
  )
}
