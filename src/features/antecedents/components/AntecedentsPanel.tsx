import { useState } from 'react'
import { Stack, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { AppButton } from '@/components/AppButton'
import { useAntecedentsByPatient } from '../hooks/useAntecedentsByPatient'
import { useCreateAntecedent } from '../hooks/useCreateAntecedent'
import { useUpdateAntecedent } from '../hooks/useUpdateAntecedent'
import { useDeleteAntecedent } from '../hooks/useDeleteAntecedent'
import { AntecedentListTable } from './AntecedentListTable'
import { SurgeryHospitalizationList } from './SurgeryHospitalizationList'
import { AntecedentFormModal } from './AntecedentFormModal'
import {
  mapFormToPayload,
  mapFormToUpdatePayload,
  mapAntecedentToForm,
} from '../utils/antecedent-mappers'
import { antecedentFormDefaultValues } from '../schemas/antecedent-form.schema'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import type { Antecedent, AntecedentType } from '../types'

interface AntecedentsPanelProps {
  patientId: number
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <AppButton
      size="small"
      variant="outlined"
      startIcon={<AddIcon sx={{ fontSize: 16 }} />}
      onClick={onClick}
    >
      Agregar
    </AppButton>
  )
}

export function AntecedentsPanel({ patientId }: AntecedentsPanelProps) {
  const { data: antecedents = [], isLoading, isError, error } =
    useAntecedentsByPatient(patientId)

  const [editing, setEditing] = useState<Antecedent | null>(null)
  const [creatingType, setCreatingType] = useState<AntecedentType | null>(null)
  const [deleting, setDeleting] = useState<Antecedent | null>(null)

  const isModalOpen = creatingType !== null || editing !== null

  const createMutation = useCreateAntecedent(patientId, {
    onSuccess: () => setCreatingType(null),
  })
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
    } else {
      createMutation.mutate({ ...mapFormToPayload(values), patientId })
    }
  }

  const initialValues: AntecedentFormValues | undefined = editing
    ? mapAntecedentToForm(editing)
    : creatingType
      ? { ...antecedentFormDefaultValues, type: creatingType }
      : undefined

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
        <CollapsibleSection
          title="Antecedentes familiares"
          defaultExpanded
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AddButton onClick={() => setCreatingType('family')} />
            </Box>
            <AntecedentListTable
              antecedents={family}
              variant="family"
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          </Stack>
        </CollapsibleSection>

        <CollapsibleSection
          title="Antecedentes personales patológicos"
          defaultExpanded
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AddButton onClick={() => setCreatingType('personal')} />
            </Box>
            <AntecedentListTable
              antecedents={personal}
              variant="personal"
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          </Stack>
        </CollapsibleSection>

        <CollapsibleSection title="Cirugías y hospitalizaciones" defaultExpanded>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AddButton onClick={() => setCreatingType('surgery')} />
            </Box>
            <SurgeryHospitalizationList
              antecedents={surgical}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          </Stack>
        </CollapsibleSection>
      </Stack>

      <AntecedentFormModal
        open={isModalOpen}
        mode={editing ? 'edit' : 'create'}
        initialValues={initialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setCreatingType(null)
          setEditing(null)
        }}
      />

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
