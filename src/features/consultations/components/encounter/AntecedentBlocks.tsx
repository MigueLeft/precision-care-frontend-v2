import { Divider, Stack } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useState } from 'react'
import {
  AntecedentEditDialog,
  useAntecedentsByPatient,
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
}

// Familiares, personales, quirúrgicos/hospitalizaciones y alergias. Solo se
// muestra lo registrado en el expediente: una consulta nueva inicia vacía.
export function AntecedentBlocks({
  patientId,
  consultationId,
  consultationDate,
  readOnly,
}: AntecedentBlocksProps) {
  const { data: antecedents = [], isLoading, isError, error } = useAntecedentsByPatient(patientId)
  const [editing, setEditing] = useState<Antecedent | null>(null)

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  const groups = groupAntecedents(antecedents)

  return (
    <>
      <Stack spacing={2.5} divider={<Divider />}>
        <FamilyAntecedentsBlock
          patientId={patientId}
          antecedents={groups.family}
          readOnly={readOnly}
          onEdit={setEditing}
        />
        <PersonalAntecedentsBlock
          patientId={patientId}
          antecedents={groups.personal}
          readOnly={readOnly}
          onEdit={setEditing}
        />
        <SurgicalAntecedentsBlock
          patientId={patientId}
          antecedents={groups.surgical}
          readOnly={readOnly}
          onEdit={setEditing}
        />
        <AllergiesBlock
          consultationId={consultationId}
          consultationDate={consultationDate}
          readOnly={readOnly}
        />
      </Stack>

      <AntecedentEditDialog
        patientId={patientId}
        antecedent={editing}
        onClose={() => setEditing(null)}
      />
    </>
  )
}
