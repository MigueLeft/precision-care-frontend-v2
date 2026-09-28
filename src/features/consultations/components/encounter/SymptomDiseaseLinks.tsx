import {
  Autocomplete,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useDiseases } from '@/features/catalogs'
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

interface DiseaseOption {
  id: number
  name: string
  group: string
}

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
  const rank = (option: DiseaseOption) => (option.group === PATIENT_GROUP ? 0 : 1)
  const options: DiseaseOption[] = catalog
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
        <Autocomplete<DiseaseOption>
          size="small"
          options={options}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => option.name}
          value={null}
          blurOnSelect
          onChange={(_, option) => {
            if (option) {
              onChange([...current, { diseaseCatalogId: option.id, status: DEFAULT_LINK_STATUS }])
            }
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Asociar diagnóstico…" />
          )}
        />
      )}
    </Stack>
  )
}
