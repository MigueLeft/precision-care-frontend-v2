import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useAntecedentFamilyCatalog } from '../hooks/useAntecedentFamilyCatalog'
import { useCreateAntecedentFamily } from '../hooks/useCreateAntecedentFamily'
import { useUpdateAntecedentFamily } from '../hooks/useUpdateAntecedentFamily'
import { useToggleAntecedentFamilyActive } from '../hooks/useToggleAntecedentFamilyActive'
import { useAntecedentPersonalCatalog } from '../hooks/useAntecedentPersonalCatalog'
import { useCreateAntecedentPersonal } from '../hooks/useCreateAntecedentPersonal'
import { useUpdateAntecedentPersonal } from '../hooks/useUpdateAntecedentPersonal'
import { useToggleAntecedentPersonalActive } from '../hooks/useToggleAntecedentPersonalActive'
import { useSurgeryCatalog } from '../hooks/useSurgeryCatalog'
import { useCreateSurgery } from '../hooks/useCreateSurgery'
import { useUpdateSurgery } from '../hooks/useUpdateSurgery'
import { useToggleSurgeryActive } from '../hooks/useToggleSurgeryActive'
import { useHospitalizationCatalog } from '../hooks/useHospitalizationCatalog'
import { useCreateHospitalization } from '../hooks/useCreateHospitalization'
import { useUpdateHospitalization } from '../hooks/useUpdateHospitalization'
import { useToggleHospitalizationActive } from '../hooks/useToggleHospitalizationActive'
import { SimpleCatalogList } from './SimpleCatalogList'

const SUB_TABS = [
  'Antecedentes familiares',
  'Antecedentes personales',
  'Cirugías',
  'Hospitalizaciones',
] as const

export function AntecedentCatalogsTab() {
  const [subTab, setSubTab] = useState(0)

  const { data: antecedentFamily = [] } = useAntecedentFamilyCatalog()
  const createAntecedentFamily = useCreateAntecedentFamily()
  const updateAntecedentFamily = useUpdateAntecedentFamily()
  const toggleAntecedentFamily = useToggleAntecedentFamilyActive()

  const { data: antecedentPersonal = [] } = useAntecedentPersonalCatalog()
  const createAntecedentPersonal = useCreateAntecedentPersonal()
  const updateAntecedentPersonal = useUpdateAntecedentPersonal()
  const toggleAntecedentPersonal = useToggleAntecedentPersonalActive()

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
          label="Antecedentes familiares"
          items={antecedentFamily}
          isCreating={createAntecedentFamily.isPending}
          isUpdating={updateAntecedentFamily.isPending}
          onCreate={(values) => createAntecedentFamily.mutate(values.name)}
          onUpdate={(id, values) => updateAntecedentFamily.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleAntecedentFamily.mutate(id)}
        />
      )}
      {subTab === 1 && (
        <SimpleCatalogList
          label="Antecedentes personales"
          items={antecedentPersonal}
          isCreating={createAntecedentPersonal.isPending}
          isUpdating={updateAntecedentPersonal.isPending}
          onCreate={(values) => createAntecedentPersonal.mutate(values.name)}
          onUpdate={(id, values) => updateAntecedentPersonal.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleAntecedentPersonal.mutate(id)}
        />
      )}
      {subTab === 2 && (
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
      {subTab === 3 && (
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
