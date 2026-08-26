import { useState } from 'react'
import { Typography, Box, Tabs, Tab } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { UsersTab } from './UsersTab'
import { RolesTab } from './RolesTab'

const TABS = [
  { label: 'Usuarios', icon: PeopleAltOutlinedIcon },
  { label: 'Roles y permisos', icon: ShieldOutlinedIcon },
] as const

export function IdentityPage() {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Usuarios y roles
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestión de accesos, roles y permisos granulares del sistema
      </Typography>

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
        {TABS.map(({ label, icon: Icon }) => (
          <Tab key={label} label={label} icon={<Icon sx={{ fontSize: 18 }} />} iconPosition="start" />
        ))}
      </Tabs>

      {tab === 0 && <UsersTab />}
      {tab === 1 && <RolesTab />}
    </Box>
  )
}
