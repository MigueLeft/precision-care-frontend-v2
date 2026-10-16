import { useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { TemplatesTab } from './TemplatesTab'
import { MedicationIndicationsTab } from './MedicationIndicationsTab'

const TABS = [
  { label: 'Plantillas', icon: ArticleOutlinedIcon },
  { label: 'Indicaciones de medicamentos', icon: MedicationOutlinedIcon },
] as const

// Configuración general de los entregables (récipe y orden de laboratorio).
export function DeliverablesSettingsPage() {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Entregables
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Textos del récipe y la orden de laboratorio, e indicaciones predefinidas de cada medicamento
      </Typography>

      <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={{ mb: 3 }}>
        {TABS.map(({ label, icon: Icon }) => (
          <Tab key={label} label={label} icon={<Icon sx={{ fontSize: 18 }} />} iconPosition="start" />
        ))}
      </Tabs>

      <ErrorBoundary>
        {tab === 0 && <TemplatesTab />}
        {tab === 1 && <MedicationIndicationsTab />}
      </ErrorBoundary>
    </Box>
  )
}
