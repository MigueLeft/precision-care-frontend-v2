import { IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from '@/utils/toast'
import { CatalogSearchInput, type CatalogOption } from '@/components/ui/CatalogSearchInput'
import { useDiseases } from '@/features/catalogs'
import { isLettersOnly } from '@/utils/text-validation'
import { SYMPTOM_STATUSES, SYMPTOM_STATUS_LABELS } from '../../../utils/consultation-format'
import { useConsultationDiseases } from '../../../hooks/useConsultationDiseases'
import type { SymptomStatus } from '../../../types'
import type { LinkedDiagnosis } from './symptom-form'

type LinkedDiagnosesFieldProps = {
  consultationId: number
  value: LinkedDiagnosis[]
  onChange: (next: LinkedDiagnosis[]) => void
}

const DEFAULT_STATUS: SymptomStatus = 'under_investigation'
const PATIENT_GROUP = 'Diagnósticos del paciente'

// Diagnósticos asociados al síntoma: entran "Bajo investigación" y cada uno
// lleva su estado. Los del paciente se listan primero en el buscador.
export function LinkedDiagnosesField({ consultationId, value, onChange }: LinkedDiagnosesFieldProps) {
  const { data: catalog = [] } = useDiseases()
  const { data: patientDiseases = [] } = useConsultationDiseases(consultationId)

  const linkedIds = new Set(value.map((link) => link.diseaseCatalogId))
  const patientIds = new Set(patientDiseases.map((disease) => disease.diseaseCatalogId))
  const rank = (option: CatalogOption) => (option.group === PATIENT_GROUP ? 0 : 1)
  const options: CatalogOption[] = catalog
    .filter((disease) => disease.active && !linkedIds.has(disease.id))
    .map((disease) => ({ id: disease.id, name: disease.name, group: patientIds.has(disease.id) ? PATIENT_GROUP : 'Catálogo' }))
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'es'))

  function add(name: string, catalogId?: number) {
    if (!catalogId && !isLettersOnly(name)) {
      toast.error('El diagnóstico solo puede contener letras, sin números ni caracteres especiales.')
      return
    }
    if (value.some((link) => link.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Ese diagnóstico ya está asociado al síntoma.')
      return
    }
    const code = catalogId ? (catalog.find((disease) => disease.id === catalogId)?.code ?? null) : null
    onChange([...value, { diseaseCatalogId: catalogId, name, code, status: DEFAULT_STATUS }])
  }

  const update = (index: number, status: SymptomStatus) =>
    onChange(value.map((link, i) => (i === index ? { ...link, status } : link)))

  return (
    <Stack spacing={0.75}>
      {value.map((link, index) => (
        <Stack key={link.diseaseCatalogId ?? link.name} direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', flex: 1, minWidth: 0 }} noWrap title={link.name}>
            {link.name}
            {link.code && <Typography component="span" sx={{ fontSize: '11.5px', color: 'text.secondary', ml: 0.5 }}>{link.code}</Typography>}
          </Typography>
          <Select<SymptomStatus>
            size="small"
            value={link.status}
            onChange={(event) => update(index, event.target.value as SymptomStatus)}
            sx={{ width: 150, fontSize: '12.5px' }}
          >
            {SYMPTOM_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {SYMPTOM_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
          <IconButton size="small" aria-label={`Quitar ${link.name}`} onClick={() => onChange(value.filter((_, i) => i !== index))}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      ))}
      <CatalogSearchInput
        options={options}
        placeholder="Asociar diagnóstico…"
        onAdd={add}
        manualLabel="No está en el catálogo · escribir manualmente"
      />
    </Stack>
  )
}
