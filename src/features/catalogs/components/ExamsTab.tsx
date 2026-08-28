import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { ExamsListTab } from './ExamsListTab'
import { ExamCategoriesTab } from './ExamCategoriesTab'

const SUB_TABS = ['Exámenes', 'Categorías'] as const

export function ExamsTab() {
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

      {subTab === 0 && <ExamsListTab />}
      {subTab === 1 && <ExamCategoriesTab />}
    </Box>
  )
}
