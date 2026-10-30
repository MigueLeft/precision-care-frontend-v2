import type { ReactNode } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { useAntecedentsByPatient, useDeleteAntecedent, type Antecedent } from '@/features/antecedents'
import { groupAntecedents } from '../../../utils/antecedent-groups'
import { useConsultationAllergies, useRemoveConsultationAllergy } from '../../../hooks/useConsultationAllergies'
import { AllergyCard } from '../../encounter/AllergyCard'
import { AllergyHistory } from '../../encounter/AllergyHistory'
import { BoardHeader } from '../BoardHeader'
import { useEncounterWorkspace } from '../workspace-context'
import { AntecedentCard } from './AntecedentCard'

type AntecedentsBoardProps = {
  patientId: number
  consultationId: number
  readOnly: boolean
}

function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <Stack spacing={1}>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', color: 'text.secondary' }}>
        {title.toUpperCase()} · {count}
      </Typography>
      {count === 0 ? (
        <Typography sx={{ fontSize: '13px', color: 'text.disabled', fontStyle: 'italic' }}>Sin registros</Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>{children}</Box>
      )}
    </Stack>
  )
}

// Antecedentes del expediente agrupados por tipo, más las alergias. Se agregan
// y se editan en el panel derecho; aquí se eligen o se quitan.
export function AntecedentsBoard({ patientId, consultationId, readOnly }: AntecedentsBoardProps) {
  const { data: antecedents = [] } = useAntecedentsByPatient(patientId)
  const { data: allergyData } = useConsultationAllergies(consultationId)
  const deleteAntecedent = useDeleteAntecedent(patientId)
  const removeAllergy = useRemoveConsultationAllergy(consultationId)
  const { editing, startEdit, clearEdit } = useEncounterWorkspace()
  const isEditing = (kind: 'antecedent' | 'allergy', id: number) => editing?.kind === kind && editing.id === id
  // Al quitar el registro que se está editando, el panel vuelve a "Agregar".
  const afterRemove = (kind: 'antecedent' | 'allergy', id: number) => ({
    onSuccess: () => {
      if (isEditing(kind, id)) clearEdit()
    },
  })

  const groups = groupAntecedents(antecedents)
  const allergies = allergyData?.allergies ?? []
  const card = (antecedent: Antecedent) => (
    <AntecedentCard
      key={antecedent.id}
      antecedent={antecedent}
      selected={isEditing('antecedent', antecedent.id)}
      readOnly={readOnly}
      onEdit={() => startEdit({ kind: 'antecedent', id: antecedent.id })}
      onRemove={() => deleteAntecedent.mutate(antecedent.id, afterRemove('antecedent', antecedent.id))}
    />
  )

  return (
    <div>
      <BoardHeader title="Antecedentes" meta={`${antecedents.length + allergies.length} registrados`} />
      <Stack spacing={2.5}>
        <Group title="Heredofamiliares" count={groups.family.length}>{groups.family.map(card)}</Group>
        <Group title="Personales" count={groups.personal.length}>{groups.personal.map(card)}</Group>
        <Group title="Cirugías y hospitalizaciones" count={groups.surgical.length}>{groups.surgical.map(card)}</Group>
        <Group title="Alergias" count={allergies.length}>
          {allergies.map((allergy) => (
            <AllergyCard
              key={allergy.id}
              allergy={allergy}
              readOnly={readOnly}
              onEdit={() => startEdit({ kind: 'allergy', id: allergy.id })}
              onRemove={() => removeAllergy.mutate(allergy.id, afterRemove('allergy', allergy.id))}
            />
          ))}
        </Group>
        {allergyData?.noKnownAllergies && <Chip size="small" label="Sin alergias conocidas" sx={{ alignSelf: 'flex-start' }} />}
        <AllergyHistory consultationId={consultationId} />
      </Stack>

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
        Los antecedentes y alergias se guardan en el expediente, no sólo en esta consulta.
      </Typography>
    </div>
  )
}
