import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatFreeDate, formatShortDate } from '@/utils/format-date'
import {
  DISEASE_STATUS_LABELS,
  diseaseStatusOptions,
} from '../../utils/consultation-format'
import {
  useConsultationDiseases,
  useAddConsultationDisease,
  useUpdateConsultationDisease,
  useRemoveConsultationDisease,
} from '../../hooks/useConsultationDiseases'
import { DiseaseHistory } from './DiseaseHistory'
import { DiseaseAddForm } from './DiseaseAddForm'
import type { DiseaseStatus } from '../../types'

interface DiseasesSectionProps {
  index: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

export function DiseasesSection({
  index,
  consultationId,
  consultationDate,
  readOnly,
}: DiseasesSectionProps) {
  const { data: diseases = [] } = useConsultationDiseases(consultationId)
  const addMutation = useAddConsultationDisease(consultationId)
  const updateMutation = useUpdateConsultationDisease(consultationId)
  const removeMutation = useRemoveConsultationDisease(consultationId)

  const usedCatalogIds = new Set(diseases.map((disease) => disease.diseaseCatalogId))

  return (
    <CollapsibleSection
      title={`${index}. Enfermedades`}
      headerMeta={
        diseases.length > 0 ? (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {diseases.length} registradas
          </Typography>
        ) : undefined
      }
      defaultExpanded
    >
      <DiseaseHistory consultationId={consultationId} />

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      <Stack spacing={0.75} sx={{ my: 1.5 }}>
        {diseases.map((disease) => (
          <Stack
            key={disease.id}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <Typography sx={{ fontSize: '14px', flex: 1 }}>
              {disease.name ?? '—'}
              {disease.code && (
                <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 0.75 }}>
                  {disease.code}
                </Typography>
              )}
            </Typography>
            {disease.dxDate && (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                dx {formatFreeDate(disease.dxDate)}
              </Typography>
            )}
            <FormControl size="small" sx={{ minWidth: 150 }} disabled={readOnly || updateMutation.isPending}>
              <Select<DiseaseStatus>
                value={disease.status}
                onChange={(event) =>
                  updateMutation.mutate({
                    diseaseId: disease.id,
                    input: { status: event.target.value as DiseaseStatus },
                  })
                }
              >
                {diseaseStatusOptions(disease.isChronic).map((value) => (
                  <MenuItem key={value} value={value}>
                    {DISEASE_STATUS_LABELS[value]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!readOnly && (
              <IconButton
                size="small"
                aria-label="Quitar enfermedad"
                onClick={() => removeMutation.mutate(disease.id)}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>

      {!readOnly && (
        <DiseaseAddForm
          onAdd={addMutation.mutate}
          isAdding={addMutation.isPending}
          usedCatalogIds={usedCatalogIds}
        />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        El aparato o sistema se toma del catálogo de enfermedades. El cambio de estado se registra en
        el historial del expediente.
      </Typography>
    </CollapsibleSection>
  )
}
