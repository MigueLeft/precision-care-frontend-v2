import { useMedicationCategories } from '../hooks/useMedicationCategories'
import { useCreateMedicationCategory } from '../hooks/useCreateMedicationCategory'
import { useUpdateMedicationCategory } from '../hooks/useUpdateMedicationCategory'
import { useToggleMedicationCategoryActive } from '../hooks/useToggleMedicationCategoryActive'
import { SimpleCatalogList } from './SimpleCatalogList'

export function MedicationCategoriesTab() {
  const { data: categories = [] } = useMedicationCategories()
  const createMutation = useCreateMedicationCategory()
  const updateMutation = useUpdateMedicationCategory()
  const toggleActiveMutation = useToggleMedicationCategoryActive()

  return (
    <SimpleCatalogList
      label="Categorías"
      items={categories}
      isCreating={createMutation.isPending}
      isUpdating={updateMutation.isPending}
      onCreate={(values) => createMutation.mutate(values.name)}
      onUpdate={(id, values) => updateMutation.mutate({ id, name: values.name })}
      onToggleActive={(id) => toggleActiveMutation.mutate(id)}
    />
  )
}
