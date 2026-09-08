import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

export interface SidebarNavItem {
  label: string
  icon: SvgIconComponent
  to?: string
}

export interface SidebarNavSection {
  title: string
  items: SidebarNavItem[]
}

// Solo los items con `to` son rutas reales; el resto se muestra visualmente
// pero sin navegación (todavía no existen esas pantallas).
export const sidebarNavConfig: SidebarNavSection[] = [
  {
    title: 'CLÍNICO',
    items: [
      { label: 'Dashboard', icon: DashboardOutlinedIcon, to: '/' },
      { label: 'Pacientes', icon: PeopleAltOutlinedIcon, to: '/pacientes' },
      { label: 'Citas', icon: EventOutlinedIcon, to: '/citas' },
      { label: 'Calendario', icon: CalendarMonthOutlinedIcon },
      { label: 'Cuestionarios', icon: AssignmentOutlinedIcon, to: '/cuestionarios' },
      { label: 'Entregables', icon: DescriptionOutlinedIcon },
    ],
  },
  {
    title: 'ADMINISTRACIÓN',
    items: [
      { label: 'Catálogos', icon: Inventory2OutlinedIcon, to: '/catalogos' },
      { label: 'Usuarios y roles', icon: AdminPanelSettingsOutlinedIcon, to: '/usuarios-y-roles' },
      { label: 'Configuración', icon: SettingsOutlinedIcon },
    ],
  },
]
