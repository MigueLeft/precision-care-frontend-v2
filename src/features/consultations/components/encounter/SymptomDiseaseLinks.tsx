import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'sonner'
import { CatalogSearchInput, type CatalogOption } from '@/components/ui/CatalogSearchInput'
import { useDiseases } from '@/features/catalogs'
import { isLettersOnly } from '@/utils/text-validation'
import {
  SYMPTOM_STATUSES,
  SYMPTOM_STATUS_LABELS,
} from '../../utils/consultation-format'
import type {
  ConsultationDisease,
  SymptomDiseaseInput,
  SymptomDiseaseLink,
  SymptomStatus,
} from '../../types'

interface SymptomDiseaseLinksProps {
  links: SymptomDiseaseLink[]
  // Diagnósticos del paciente: se listan primero en el buscador.
  patientDiseases: ConsultationDisease[]
  readOnly: boolean
  onChange: (next: SymptomDiseaseInput[]) => void
}

const DEFAULT_LINK_STATUS: SymptomStatus = 'under_investigation'
const PATIENT_GROUP = 'Diagnósticos del paciente'

// Diagnósticos asociados a un síntoma: cada uno con su estado (por defecto
// "Bajo investigación") para registrar si el síntoma lo apoya o lo descarta.
export function SymptomDiseaseLinks({
  links,
  patientDiseases,
  readOnly,
  onChange,
}: SymptomDiseaseLinksProps) {
  const { data: catalog = [] } = useDiseases()

  const linkedIds = new Set(links.map((link) => link.diseaseCatalogId))
  const patientIds = new Set(patientDiseases.map((d) => d.diseaseCatalogId))
  const rank = (option: CatalogOption) => (option.group === PATIENT_GROUP ? 0 : 1)
  const options: CatalogOption[] = catalog
    .filter((disease) => disease.active && !linkedIds.has(disease.id))
    .map((disease) => ({
      id: disease.id,
      name: disease.name,
      group: patientIds.has(disease.id) ? PATIENT_GROUP : 'Catálogo',
    }))
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'es'))

  const current = links.map(({ diseaseCatalogId, status }) => ({ diseaseCatalogId, status }))

  const setStatus = (diseaseCatalogId: number, status: SymptomStatus) =>
    onChange(current.map((l) => (l.diseaseCatalogId === diseaseCatalogId ? { ...l, status } : l)))

  // Del catálogo llega con id; escrito a mano, solo el nombre (se da de alta al guardar).
  function add(name: string, catalogId?: number) {
    if (catalogId) {
      onChange([...current, { diseaseCatalogId: catalogId, status: DEFAULT_LINK_STATUS }])
      return
    }
    if (!isLettersOnly(name)) {
      toast.error('El diagnóstico solo puede contener letras, sin números ni caracteres especiales.')
      return
    }
    const lower = name.toLowerCase()
    if (links.some((link) => link.name?.toLowerCase() === lower)) {
      toast.error('Ese diagnóstico ya está asociado al síntoma.')
      return
    }
    onChange([...current, { name, status: DEFAULT_LINK_STATUS }])
  }

  return (
    <Stack spacing={0.75} sx={{ mt: 1 }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>
        Diagnósticos asociados
      </Typography>

      {links.map((link) => (
        <Stack key={link.diseaseCatalogId} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', flex: 1, minWidth: 0 }} noWrap>
            {link.name ?? '—'}
            {link.code ? ` (${link.code})` : ''}
          </Typography>
          <Select<SymptomStatus>
            size="small"
            value={link.status}
            disabled={readOnly}
            onChange={(event) => setStatus(link.diseaseCatalogId, event.target.value as SymptomStatus)}
            sx={{ minWidth: 170, fontSize: '13px' }}
          >
            {SYMPTOM_STATUSES.map((value) => (
              <MenuItem key={value} value={value}>
                {SYMPTOM_STATUS_LABELS[value]}
              </MenuItem>
            ))}
          </Select>
          {!readOnly && (
            <IconButton
              size="small"
              aria-label="Quitar diagnóstico asociado"
              onClick={() => onChange(current.filter((l) => l.diseaseCatalogId !== link.diseaseCatalogId))}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Stack>
      ))}

      {!readOnly && (
        <CatalogSearchInput
          options={options}
          placeholder="Asociar diagnóstico…"
          onAdd={add}
          manualLabel="El diagnóstico no está en el catálogo · escribir manualmente"
        />
      )}
    </Stack>
  )
}
