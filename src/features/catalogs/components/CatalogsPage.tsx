import { useState } from 'react'
import { Typography, Box, Tabs, Tab } from '@mui/material'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import { MedicationsTab } from './MedicationsTab'
import { ParaclinicalsTab } from './ParaclinicalsTab'
import { SymptomsTab } from './SymptomsTab'
import { DemographicListsTab } from './DemographicListsTab'
import { BodySystemsTab } from './BodySystemsTab'
import { MedicalSpecialtiesTab } from './MedicalSpecialtiesTab'

const TABS = [
  { label: 'Medicamentos', icon: LinkOutlinedIcon },
  { label: 'Paraclínicos', icon: ScienceOutlinedIcon },
  { label: 'Síntomas', icon: MonitorHeartOutlinedIcon },
  { label: 'Aparatos / Sistemas', icon: AccessibilityNewOutlinedIcon },
  { label: 'Especialidades', icon: LocalHospitalOutlinedIcon },
  { label: 'Listas demográficas', icon: ListOutlinedIcon },
] as const

export function CatalogsPage() {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Catálogos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestión de catálogos clínicos y listas de referencia del sistema
      </Typography>

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        {TABS.map(({ label, icon: Icon }) => (
          <Tab key={label} label={label} icon={<Icon sx={{ fontSize: 18 }} />} iconPosition="start" />
        ))}
      </Tabs>

      {tab === 0 && <MedicationsTab />}
      {tab === 1 && <ParaclinicalsTab />}
      {tab === 2 && <SymptomsTab />}
      {tab === 3 && <BodySystemsTab />}
      {tab === 4 && <MedicalSpecialtiesTab />}
      {tab === 5 && <DemographicListsTab />}
    </Box>
  )
}
