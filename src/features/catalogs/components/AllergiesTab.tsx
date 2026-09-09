import { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { useAllergyTypes } from '../hooks/useAllergyTypes'
import { useCreateAllergyType } from '../hooks/useCreateAllergyType'
import { useUpdateAllergyType } from '../hooks/useUpdateAllergyType'
import { useToggleAllergyTypeActive } from '../hooks/useToggleAllergyTypeActive'
import { useAllergySeverities } from '../hooks/useAllergySeverities'
import { useCreateAllergySeverity } from '../hooks/useCreateAllergySeverity'
import { useUpdateAllergySeverity } from '../hooks/useUpdateAllergySeverity'
import { useToggleAllergySeverityActive } from '../hooks/useToggleAllergySeverityActive'
import { SimpleCatalogList } from './SimpleCatalogList'
import { AllergyCatalogListTab } from './AllergyCatalogListTab'

const SUB_TABS = ['Alergias', 'Tipos', 'Gravedades'] as const

export function AllergiesTab() {
  const [subTab, setSubTab] = useState(0)

  const { data: types = [] } = useAllergyTypes()
  const createType = useCreateAllergyType()
  const updateType = useUpdateAllergyType()
  const toggleType = useToggleAllergyTypeActive()

  const { data: severities = [] } = useAllergySeverities()
  const createSeverity = useCreateAllergySeverity()
  const updateSeverity = useUpdateAllergySeverity()
  const toggleSeverity = useToggleAllergySeverityActive()

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

      {subTab === 0 && <AllergyCatalogListTab />}
      {subTab === 1 && (
        <SimpleCatalogList
          label="Tipos de alergia"
          items={types}
          isCreating={createType.isPending}
          isUpdating={updateType.isPending}
          onCreate={(values) => createType.mutate(values.name)}
          onUpdate={(id, values) => updateType.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleType.mutate(id)}
        />
      )}
      {subTab === 2 && (
        <SimpleCatalogList
          label="Gravedades"
          items={severities}
          isCreating={createSeverity.isPending}
          isUpdating={updateSeverity.isPending}
          onCreate={(values) => createSeverity.mutate(values.name)}
          onUpdate={(id, values) => updateSeverity.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleSeverity.mutate(id)}
        />
      )}
    </Box>
  )
}
