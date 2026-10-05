import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useSurgeryCatalog } from '../hooks/useSurgeryCatalog'
import { useCreateSurgery } from '../hooks/useCreateSurgery'
import { useUpdateSurgery } from '../hooks/useUpdateSurgery'
import { useToggleSurgeryActive } from '../hooks/useToggleSurgeryActive'
import { useHospitalizationCatalog } from '../hooks/useHospitalizationCatalog'
import { useCreateHospitalization } from '../hooks/useCreateHospitalization'
import { useUpdateHospitalization } from '../hooks/useUpdateHospitalization'
import { useToggleHospitalizationActive } from '../hooks/useToggleHospitalizationActive'
import { SimpleCatalogList } from './SimpleCatalogList'

const SUB_TABS = ['Cirugías', 'Hospitalizaciones'] as const

// Catálogos propios de los antecedentes quirúrgicos. Los antecedentes familiares
// y personales usan el catálogo de enfermedades (pestaña "Enfermedades").
export function AntecedentCatalogsTab() {
  const [subTab, setSubTab] = useState(0)

  const { data: surgeries = [] } = useSurgeryCatalog()
  const createSurgery = useCreateSurgery()
  const updateSurgery = useUpdateSurgery()
  const toggleSurgery = useToggleSurgeryActive()

  const { data: hospitalizationReasons = [] } = useHospitalizationCatalog()
  const createHospitalization = useCreateHospitalization()
  const updateHospitalization = useUpdateHospitalization()
  const toggleHospitalization = useToggleHospitalizationActive()

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, value) => setSubTab(value)}
        sx={{ mb: 3, minHeight: 36, '& .MuiTab-root': { minHeight: 36, fontSize: '13px' } }}
      >
        {SUB_TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {subTab === 0 && (
        <SimpleCatalogList
          label="Cirugías"
          items={surgeries}
          isCreating={createSurgery.isPending}
          isUpdating={updateSurgery.isPending}
          onCreate={(values) => createSurgery.mutate(values.name)}
          onUpdate={(id, values) => updateSurgery.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleSurgery.mutate(id)}
        />
      )}
      {subTab === 1 && (
        <SimpleCatalogList
          label="Hospitalizaciones"
          items={hospitalizationReasons}
          isCreating={createHospitalization.isPending}
          isUpdating={updateHospitalization.isPending}
          onCreate={(values) => createHospitalization.mutate(values.name)}
          onUpdate={(id, values) => updateHospitalization.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleHospitalization.mutate(id)}
        />
      )}
    </Box>
  )
}
