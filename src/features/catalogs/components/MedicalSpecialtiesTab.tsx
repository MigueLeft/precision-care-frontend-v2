import { useMedicalSpecialties } from '../hooks/useMedicalSpecialties'
import { useCreateMedicalSpecialty } from '../hooks/useCreateMedicalSpecialty'
import { useUpdateMedicalSpecialty } from '../hooks/useUpdateMedicalSpecialty'
import { useToggleMedicalSpecialtyActive } from '../hooks/useToggleMedicalSpecialtyActive'
import { SimpleCatalogList } from './SimpleCatalogList'

export function MedicalSpecialtiesTab() {
  const { data: specialties = [] } = useMedicalSpecialties()
  const createMutation = useCreateMedicalSpecialty()
  const updateMutation = useUpdateMedicalSpecialty()
  const toggleActiveMutation = useToggleMedicalSpecialtyActive()

  return (
    <SimpleCatalogList
      label="Especialidades médicas"
      items={specialties}
      isCreating={createMutation.isPending}
      isUpdating={updateMutation.isPending}
      onCreate={(values) => createMutation.mutate(values.name)}
      onUpdate={(id, values) => updateMutation.mutate({ id, name: values.name })}
      onToggleActive={(id) => toggleActiveMutation.mutate(id)}
    />
  )
}
