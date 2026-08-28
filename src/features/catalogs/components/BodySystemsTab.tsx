import { useBodySystems } from '../hooks/useBodySystems'
import { useCreateBodySystem } from '../hooks/useCreateBodySystem'
import { useUpdateBodySystem } from '../hooks/useUpdateBodySystem'
import { useToggleBodySystemActive } from '../hooks/useToggleBodySystemActive'
import { SimpleCatalogList } from './SimpleCatalogList'

export function BodySystemsTab() {
  const { data: bodySystems = [] } = useBodySystems()
  const createMutation = useCreateBodySystem()
  const updateMutation = useUpdateBodySystem()
  const toggleActiveMutation = useToggleBodySystemActive()

  return (
    <SimpleCatalogList
      label="Aparatos/sistemas"
      items={bodySystems}
      isCreating={createMutation.isPending}
      isUpdating={updateMutation.isPending}
      onCreate={(values) => createMutation.mutate(values.name)}
      onUpdate={(id, values) => updateMutation.mutate({ id, name: values.name })}
      onToggleActive={(id) => toggleActiveMutation.mutate(id)}
    />
  )
}
