import { useMedicationPresentations } from '../hooks/useMedicationPresentations'
import { useCreateMedicationPresentation } from '../hooks/useCreateMedicationPresentation'
import { useUpdateMedicationPresentation } from '../hooks/useUpdateMedicationPresentation'
import { useToggleMedicationPresentationActive } from '../hooks/useToggleMedicationPresentationActive'
import { SimpleCatalogList } from './SimpleCatalogList'

export function MedicationPresentationsTab() {
  const { data: presentations = [] } = useMedicationPresentations()
  const createMutation = useCreateMedicationPresentation()
  const updateMutation = useUpdateMedicationPresentation()
  const toggleActiveMutation = useToggleMedicationPresentationActive()

  return (
    <SimpleCatalogList
      label="Presentaciones"
      items={presentations}
      isCreating={createMutation.isPending}
      isUpdating={updateMutation.isPending}
      onCreate={(values) => createMutation.mutate(values.name)}
      onUpdate={(id, values) => updateMutation.mutate({ id, name: values.name })}
      onToggleActive={(id) => toggleActiveMutation.mutate(id)}
    />
  )
}
