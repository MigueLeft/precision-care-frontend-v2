import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SectionCard } from '@/components/ui/SectionCard'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { AppButton } from '@/components/AppButton'
import { usePatientAllergies } from '@/features/patients'
import { useMe } from '@/features/identity'
import { todayIsoDate } from '@/utils/format-date'
import { usePatientMedications } from '../hooks/usePatientMedications'
import { useCreatePatientMedication } from '../hooks/useCreatePatientMedication'
import { useUpdatePatientMedication } from '../hooks/useUpdatePatientMedication'
import {
  getCurrentMedications,
  getPreviousMedications,
} from '../utils/medication-helpers'
import { CurrentMedicationsTable } from './CurrentMedicationsTable'
import { PreviousMedicationsTable } from './PreviousMedicationsTable'
import { AddMedicationModal } from './AddMedicationModal'
import { SuspendMedicationDialog } from './SuspendMedicationDialog'
import type { MedicationFormValues } from '../schemas/medication-form.schema'
import type { PatientMedication } from '../types'
import { medicationSchedulePayload } from '../utils/medication-form'

interface MedicationsPanelProps {
  patientId: number
}

export function MedicationsPanel({ patientId }: MedicationsPanelProps) {
  const { data: medications = [], isLoading, isError, error } =
    usePatientMedications(patientId)
  const { data: allergies = [] } = usePatientAllergies(patientId)
  const { data: me } = useMe()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editing, setEditing] = useState<PatientMedication | null>(null)
  const [suspending, setSuspending] = useState<PatientMedication | null>(null)

  const createMutation = useCreatePatientMedication(patientId, {
    onSuccess: () => setIsAddOpen(false),
  })
  const suspendMutation = useUpdatePatientMedication(patientId, {
    successMessage: 'Medicamento suspendido',
    onSuccess: () => setSuspending(null),
  })
  const updateMutation = useUpdatePatientMedication(patientId, {
    onSuccess: () => setEditing(null),
  })

  const current = getCurrentMedications(medications)
  const previous = getPreviousMedications(medications)

  function handleAdd(values: MedicationFormValues) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: {
        ...medicationSchedulePayload(values),
        startAt: values.startAt || null,
      } })
      return
    }
    createMutation.mutate({
      ...medicationSchedulePayload(values),
      patientId,
      medicationId: values.medicationId,
      status: 'current',
      startAt: values.startAt || undefined,
    })
  }

  function handleSuspend(reason: string) {
    if (!suspending) return
    suspendMutation.mutate({
      id: suspending.id,
      payload: {
        status: 'previous',
        endAt: todayIsoDate(),
        discontinuationReason: reason || undefined,
      },
    })
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
      <Stack spacing={3}>
        <SectionCard
          title="Medicamentos actuales"
          action={me?.permissions.includes('medicamentos:create') && (
            <AppButton
              size="small"
              variant="outlined"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setIsAddOpen(true)}
            >
              Agregar medicamento
            </AppButton>
          )}
        >
          <CurrentMedicationsTable medications={current} onEdit={me?.permissions.includes('medicamentos:update') ? setEditing : undefined} onSuspend={me?.permissions.includes('medicamentos:update') ? setSuspending : undefined} />
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 1.5 }}>
            Al agregar se valida contra las alergias del paciente; si hay conflicto la acción se
            bloquea.
          </Typography>
        </SectionCard>

        <SectionCard title="Medicamentos previos">
          <PreviousMedicationsTable medications={previous} onEdit={me?.permissions.includes('medicamentos:update') ? setEditing : undefined} />
        </SectionCard>
      </Stack>

      {(isAddOpen || editing) && <AddMedicationModal
        key={editing?.id ?? 'new'}
        medication={editing ?? undefined}
        allergies={allergies}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleAdd}
        onClose={() => { setIsAddOpen(false); setEditing(null) }}
      />}

      {suspending && (
        <SuspendMedicationDialog
          medication={suspending}
          isSubmitting={suspendMutation.isPending}
          onConfirm={handleSuspend}
          onClose={() => setSuspending(null)}
        />
      )}
    </>
  )
}
