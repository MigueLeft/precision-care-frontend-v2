import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SectionCard } from '@/components/ui/SectionCard'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { AppButton } from '@/components/AppButton'
import { usePatientAllergies } from '@/features/patients'
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

interface MedicationsPanelProps {
  patientId: number
}

export function MedicationsPanel({ patientId }: MedicationsPanelProps) {
  const { data: medications = [], isLoading, isError, error } =
    usePatientMedications(patientId)
  const { data: allergies = [] } = usePatientAllergies(patientId)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [suspending, setSuspending] = useState<PatientMedication | null>(null)

  const createMutation = useCreatePatientMedication(patientId, {
    onSuccess: () => setIsAddOpen(false),
  })
  const suspendMutation = useUpdatePatientMedication(patientId, {
    successMessage: 'Medicamento suspendido',
    onSuccess: () => setSuspending(null),
  })

  const current = getCurrentMedications(medications)
  const previous = getPreviousMedications(medications)

  function handleAdd(values: MedicationFormValues) {
    createMutation.mutate({
      patientId,
      medicationId: values.medicationId,
      status: 'current',
      dose: values.dose || undefined,
      frequency: values.frequency || undefined,
      duration: values.duration || undefined,
      quantity: values.quantity || undefined,
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
          action={
            <AppButton
              size="small"
              variant="outlined"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setIsAddOpen(true)}
            >
              Agregar medicamento
            </AppButton>
          }
        >
          <CurrentMedicationsTable medications={current} onSuspend={setSuspending} />
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 1.5 }}>
            Al agregar se valida contra las alergias del paciente; si hay conflicto la acción se
            bloquea.
          </Typography>
        </SectionCard>

        <SectionCard title="Medicamentos previos">
          <PreviousMedicationsTable medications={previous} />
        </SectionCard>
      </Stack>

      <AddMedicationModal
        open={isAddOpen}
        allergies={allergies}
        isSubmitting={createMutation.isPending}
        onSubmit={handleAdd}
        onClose={() => setIsAddOpen(false)}
      />

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
