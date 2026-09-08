import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

// Clave para el badge de conteo del submenú (se llena por fase).
export type MedicalRecordCountKey =
  | 'consultas'
  | 'paraclinicos'
  | 'medicamentos'
  | 'ingresables'
  | 'entregables'

// `to` es la ruta absoluta type-safe de TanStack Router para el segmento.
export type MedicalRecordTabTo =
  | '/pacientes/$patientId/resumen'
  | '/pacientes/$patientId/antecedentes'
  | '/pacientes/$patientId/consultas'
  | '/pacientes/$patientId/paraclinicos'
  | '/pacientes/$patientId/medicamentos'
  | '/pacientes/$patientId/examen-fisico'
  | '/pacientes/$patientId/composicion-corporal'
  | '/pacientes/$patientId/estilo-de-vida'
  | '/pacientes/$patientId/ingresables'
  | '/pacientes/$patientId/entregables'

export interface MedicalRecordTab {
  slug: string
  to: MedicalRecordTabTo
  label: string
  icon: SvgIconComponent
  countKey?: MedicalRecordCountKey
}

// El orden coincide con el submenú de las pantallas de referencia.
export const MEDICAL_RECORD_TABS: MedicalRecordTab[] = [
  {
    slug: 'resumen',
    to: '/pacientes/$patientId/resumen',
    label: 'Resumen',
    icon: GridViewOutlinedIcon,
  },
  {
    slug: 'antecedentes',
    to: '/pacientes/$patientId/antecedentes',
    label: 'Antecedentes',
    icon: HistoryOutlinedIcon,
  },
  {
    slug: 'consultas',
    to: '/pacientes/$patientId/consultas',
    label: 'Consultas',
    icon: MedicalInformationOutlinedIcon,
    countKey: 'consultas',
  },
  {
    slug: 'paraclinicos',
    to: '/pacientes/$patientId/paraclinicos',
    label: 'Paraclínicos',
    icon: ScienceOutlinedIcon,
    countKey: 'paraclinicos',
  },
  {
    slug: 'medicamentos',
    to: '/pacientes/$patientId/medicamentos',
    label: 'Medicamentos',
    icon: MedicationOutlinedIcon,
    countKey: 'medicamentos',
  },
  {
    slug: 'examen-fisico',
    to: '/pacientes/$patientId/examen-fisico',
    label: 'Examen físico',
    icon: MonitorHeartOutlinedIcon,
  },
  {
    slug: 'composicion-corporal',
    to: '/pacientes/$patientId/composicion-corporal',
    label: 'Composición corporal',
    icon: AccessibilityNewOutlinedIcon,
  },
  {
    slug: 'estilo-de-vida',
    to: '/pacientes/$patientId/estilo-de-vida',
    label: 'Estilo de vida',
    icon: FavoriteBorderOutlinedIcon,
  },
  {
    slug: 'ingresables',
    to: '/pacientes/$patientId/ingresables',
    label: 'Ingresables',
    icon: AssignmentOutlinedIcon,
    countKey: 'ingresables',
  },
  {
    slug: 'entregables',
    to: '/pacientes/$patientId/entregables',
    label: 'Entregables',
    icon: DescriptionOutlinedIcon,
    countKey: 'entregables',
  },
]

export type MedicalRecordCounts = Partial<Record<MedicalRecordCountKey, number>>
