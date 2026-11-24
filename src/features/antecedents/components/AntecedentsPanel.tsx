import { useState } from 'react'
import { Stack } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useAntecedentsByPatient } from '../hooks/useAntecedentsByPatient'
import { useCreateAntecedents } from '../hooks/useCreateAntecedents'
import { useUpdateAntecedent } from '../hooks/useUpdateAntecedent'
import { useDeleteAntecedent } from '../hooks/useDeleteAntecedent'
import { AntecedentListTable } from './AntecedentListTable'
import { SurgeryHospitalizationList } from './SurgeryHospitalizationList'
import { AntecedentFormModal } from './AntecedentFormModal'
import { CreateAntecedentsModal } from './CreateAntecedentsModal'
import { AntecedentSection } from './AntecedentSection'
import {
  mapFormToUpdatePayload,
  mapAntecedentToForm,
} from '../utils/antecedent-mappers'
import { antecedentFormDefaultValues } from '../schemas/antecedent-form.schema'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import type { Antecedent, AntecedentType } from '../types'

interface AntecedentsPanelProps {
  patientId: number
}

export function AntecedentsPanel({ patientId }: AntecedentsPanelProps) {
  const { data: antecedents = [], isLoading, isError, error } =
    useAntecedentsByPatient(patientId)

  const [editing, setEditing] = useState<Antecedent | null>(null)
  const [creatingType, setCreatingType] = useState<AntecedentType | null>(null)
  const [deleting, setDeleting] = useState<Antecedent | null>(null)

  const createMutation = useCreateAntecedents(patientId)
  const updateMutation = useUpdateAntecedent(patientId, editing?.id, {
    onSuccess: () => setEditing(null),
  })
  const deleteMutation = useDeleteAntecedent(patientId, {
    onSuccess: () => setDeleting(null),
  })

  const family = antecedents.filter((a) => a.type === 'family')
  const personal = antecedents.filter((a) => a.type === 'personal' || a.type === 'other')
  const surgical = antecedents.filter(
    (a) => a.type === 'surgery' || a.type === 'hospitalization',
  )

  function handleSubmit(values: AntecedentFormValues) {
    if (editing) {
      updateMutation.mutate(mapFormToUpdatePayload(values))
    }
  }

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  return (
    <>
      <Stack spacing={2}>
        <AntecedentSection title="Antecedentes familiares" onAdd={() => setCreatingType('family')}>
          <AntecedentListTable antecedents={family} variant="family" onEdit={setEditing} onDelete={setDeleting} />
        </AntecedentSection>

        <AntecedentSection title="Antecedentes personales" onAdd={() => setCreatingType('personal')}>
          <AntecedentListTable antecedents={personal} variant="personal" onEdit={setEditing} onDelete={setDeleting} />
        </AntecedentSection>

        <AntecedentSection title="Cirugías y hospitalizaciones" onAdd={() => setCreatingType('surgery')}>
          <SurgeryHospitalizationList antecedents={surgical} onEdit={setEditing} onDelete={setDeleting} />
        </AntecedentSection>
      </Stack>

      {editing && <AntecedentFormModal
        key={editing.id}
        open
        mode="edit"
        initialValues={mapAntecedentToForm(editing)}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setCreatingType(null)
          setEditing(null)
        }}
      />}

      {creatingType && <CreateAntecedentsModal
        initialValues={{ ...antecedentFormDefaultValues, type: creatingType }}
        isSubmitting={createMutation.isPending}
        onSubmit={async (values) => {
          const { failed } = await createMutation.mutateAsync(values)
          if (!failed.length) setCreatingType(null)
          return failed
        }}
        onClose={() => setCreatingType(null)}
      />}

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar antecedente"
        description={`¿Eliminar "${deleting?.name ?? ''}" del expediente?`}
        isConfirming={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </>
  )
}
