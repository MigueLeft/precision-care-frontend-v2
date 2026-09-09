import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import {
  DISEASE_STATUS_COLORS,
  DISEASE_STATUS_LABELS,
} from '../../utils/consultation-format'
import {
  useConsultationDiseases,
  useAddConsultationDisease,
  useRemoveConsultationDisease,
} from '../../hooks/useConsultationDiseases'
import { DiseaseHistory } from './DiseaseHistory'
import { DiseaseAddForm } from './DiseaseAddForm'
import type { ConsultationDisease } from '../../types'

interface DiseasesSectionProps {
  index: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

function groupBySystem(diseases: ConsultationDisease[]) {
  const groups = new Map<string, ConsultationDisease[]>()
  for (const disease of diseases) {
    const key = disease.bodySystemName ?? 'Sin asignar'
    groups.set(key, [...(groups.get(key) ?? []), disease])
  }
  return [...groups.entries()]
}

export function DiseasesSection({
  index,
  consultationId,
  consultationDate,
  readOnly,
}: DiseasesSectionProps) {
  const { data: diseases = [] } = useConsultationDiseases(consultationId)
  const addMutation = useAddConsultationDisease(consultationId)
  const removeMutation = useRemoveConsultationDisease(consultationId)

  const groups = groupBySystem(diseases)

  return (
    <CollapsibleSection
      title={`${index}. Enfermedades / diagnósticos`}
      headerMeta={
        diseases.length > 0 ? (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {diseases.length} activas
          </Typography>
        ) : undefined
      }
      defaultExpanded
    >
      <DiseaseHistory consultationId={consultationId} />

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      <Stack spacing={1.5} sx={{ my: 1.5 }}>
        {groups.map(([systemName, rows]) => (
          <Box key={systemName}>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              {systemName}
            </Typography>
            <Stack spacing={0.5}>
              {rows.map((disease) => (
                <Stack
                  key={disease.id}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Typography sx={{ fontSize: '14px', flex: 1 }}>
                    {disease.name ?? '—'}
                  </Typography>
                  {disease.dxDate && (
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      dx {disease.dxDate}
                    </Typography>
                  )}
                  <Chip
                    size="small"
                    label={DISEASE_STATUS_LABELS[disease.status]}
                    color={DISEASE_STATUS_COLORS[disease.status]}
                  />
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
          </Box>
        ))}
      </Stack>

      {!readOnly && (
        <DiseaseAddForm onAdd={addMutation.mutate} isAdding={addMutation.isPending} />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Cada enfermedad se asocia a un aparato o sistema del catálogo; el listado se agrupa por
        sistema. Texto libre permitido si no existe en el catálogo.
      </Typography>
    </CollapsibleSection>
  )
}
