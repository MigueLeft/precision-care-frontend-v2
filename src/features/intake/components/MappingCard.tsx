import { Box, Stack, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { RangeInterpretationEditor } from './RangeInterpretationEditor'
import type { IntakeMapping } from '../types'

const DESTINATION_LABELS: Record<IntakeMapping['destinationType'], string> = {
  antecedent: 'Antecedente',
  allergy: 'Alergia',
  lifestyle: 'Estilo de vida',
  patient_field: 'Campo del paciente',
  body_composition: 'Composición corporal',
  custom: 'Personalizado',
}

const SCORING_LABELS: Record<IntakeMapping['scoringType'], string> = {
  sum: 'Suma simple',
  weighted_sum: 'Suma ponderada',
  range_lookup: 'Interpretación por rango',
  custom_function: 'Función personalizada',
}

interface MappingCardProps {
  intakeId: number
  mapping: IntakeMapping
  onEdit: () => void
  onDelete: () => void
}

export function MappingCard({ intakeId, mapping, onEdit, onDelete }: MappingCardProps) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
          <Chip label={DESTINATION_LABELS[mapping.destinationType]} size="small" color="primary" />
          <Chip label={SCORING_LABELS[mapping.scoringType]} size="small" variant="outlined" />
          {mapping.destinationField && <Chip label={mapping.destinationField} size="small" />}
        </Stack>
        <Stack direction="row">
          <Tooltip title="Editar mapeo">
            <IconButton size="small" onClick={onEdit} aria-label="Editar mapeo">
              <EditOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar mapeo">
            <IconButton size="small" onClick={onDelete} aria-label="Eliminar mapeo">
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {mapping.scoringType === 'range_lookup' && (
        <RangeInterpretationEditor
          intakeId={intakeId}
          mappingId={mapping.id}
          interpretations={mapping.interpretations}
        />
      )}
    </Box>
  )
}
