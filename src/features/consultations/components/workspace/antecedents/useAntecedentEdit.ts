import {
  mapAntecedentToForm,
  mapFormToUpdatePayload,
  useUpdateAntecedent,
  type Antecedent,
  type AntecedentFormValues,
} from '@/features/antecedents'

// Guarda los cambios de un antecedente desde el panel de captura: parte de lo
// guardado (institución, médico, etc. se conservan) y aplica solo lo editado.
export function useAntecedentEdit(patientId: number, antecedent: Antecedent | null, onDone: () => void) {
  const update = useUpdateAntecedent(patientId, antecedent?.id, { onSuccess: onDone })

  const save = (patch: Partial<AntecedentFormValues>) => {
    if (!antecedent) return
    update.mutate(mapFormToUpdatePayload({ ...mapAntecedentToForm(antecedent), ...patch }))
  }

  return { save, isPending: update.isPending }
}
