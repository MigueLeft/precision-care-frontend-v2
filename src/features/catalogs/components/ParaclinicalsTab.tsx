import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { ParaclinicalsListTab } from './ParaclinicalsListTab'
import { ParaclinicalCategoriesTab } from './ParaclinicalCategoriesTab'

const SUB_TABS = ['Paraclínicos', 'Categorías'] as const

export function ParaclinicalsTab() {
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

      {subTab === 0 && <ParaclinicalsListTab />}
      {subTab === 1 && <ParaclinicalCategoriesTab />}
    </Box>
  )
}
