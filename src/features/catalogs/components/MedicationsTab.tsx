import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { MedicationsListTab } from './MedicationsListTab'
import { MedicationPresentationsTab } from './MedicationPresentationsTab'
import { MedicationCategoriesTab } from './MedicationCategoriesTab'

const SUB_TABS = ['Medicamentos', 'Presentaciones', 'Categorías'] as const

export function MedicationsTab() {
  const [subTab, setSubTab] = useState(0)

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

      {subTab === 0 && <MedicationsListTab />}
      {subTab === 1 && <MedicationPresentationsTab />}
      {subTab === 2 && <MedicationCategoriesTab />}
    </Box>
  )
}
