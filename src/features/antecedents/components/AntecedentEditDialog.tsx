import { useUpdateAntecedent } from '../hooks/useUpdateAntecedent'
import { mapAntecedentToForm, mapFormToUpdatePayload } from '../utils/antecedent-mappers'
import type { Antecedent } from '../types'
import { AntecedentFormModal } from './AntecedentFormModal'

type AntecedentEditDialogProps = {
  patientId: number
  /** Antecedente en edición; null = diálogo cerrado. */
  antecedent: Antecedent | null
  onClose: () => void
}

// Edición de un antecedente ya registrado (mismo formulario del expediente),
// para reutilizarla desde la consulta.
export function AntecedentEditDialog({ patientId, antecedent, onClose }: AntecedentEditDialogProps) {
  const updateMutation = useUpdateAntecedent(patientId, antecedent?.id, { onSuccess: onClose })

  return (
    <AntecedentFormModal
      open={antecedent !== null}
      mode="edit"
      initialValues={antecedent ? mapAntecedentToForm(antecedent) : undefined}
      lockType
      isSubmitting={updateMutation.isPending}
      onSubmit={(values) => updateMutation.mutate(mapFormToUpdatePayload(values))}
      onClose={onClose}
    />
  )
}
