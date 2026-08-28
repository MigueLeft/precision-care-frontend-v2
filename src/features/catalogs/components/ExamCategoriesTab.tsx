import { useExamCategories } from '../hooks/useExamCategories'
import { useCreateExamCategory } from '../hooks/useCreateExamCategory'
import { useUpdateExamCategory } from '../hooks/useUpdateExamCategory'
import { useToggleExamCategoryActive } from '../hooks/useToggleExamCategoryActive'
import { SimpleCatalogList } from './SimpleCatalogList'

export function ExamCategoriesTab() {
  const { data: examCategories = [] } = useExamCategories()
  const createMutation = useCreateExamCategory()
  const updateMutation = useUpdateExamCategory()
  const toggleActiveMutation = useToggleExamCategoryActive()

  return (
    <SimpleCatalogList
      label="Categorías de examen"
      items={examCategories}
      isCreating={createMutation.isPending}
      isUpdating={updateMutation.isPending}
      onCreate={(values) => createMutation.mutate(values.name)}
      onUpdate={(id, values) => updateMutation.mutate({ id, name: values.name })}
      onToggleActive={(id) => toggleActiveMutation.mutate(id)}
    />
  )
}
