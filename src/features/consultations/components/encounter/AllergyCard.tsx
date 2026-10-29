import { Box, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { isSevereAllergy } from '../../utils/allergy'
import type { ConsultationAllergy } from '../../types'

type AllergyCardProps = {
  allergy: ConsultationAllergy
  readOnly: boolean
  onEdit: () => void
  onRemove: () => void
}

// Alergia del paciente en la consulta: agente, tipo, severidad, año y reacción.
export function AllergyCard({ allergy, readOnly, onEdit, onRemove }: AllergyCardProps) {
  const severe = isSevereAllergy(allergy)
  return (
    <Box
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: severe ? 'error.light' : 'divider',
        bgcolor: severe ? theme.palette.error.light + '14' : 'transparent',
      })}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography sx={{ fontSize: '14px' }}>
          <Box component="span" sx={{ fontWeight: 700, color: severe ? 'error.main' : 'text.primary' }}>
            {allergy.name ?? '—'}
          </Box>
          <Box component="span" sx={{ color: 'text.secondary' }}>
            {allergy.typeName ? `  ${allergy.typeName}` : ''}
            {allergy.severityName ? `  ${allergy.severityName}` : ''}
            {allergy.onsetYear ? `  desde ${allergy.onsetYear}` : ''}
          </Box>
        </Typography>
        {!readOnly && (
          <Stack direction="row">
            <IconButton size="small" aria-label="Editar alergia" onClick={onEdit}>
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton size="small" aria-label="Quitar alergia" onClick={onRemove}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        )}
      </Stack>
      {allergy.reaction && (
        <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: 'text.secondary' }}>
          {allergy.reaction}
        </Typography>
      )}
    </Box>
  )
}
