import { IconButton, Stack, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined'

type MedicationActionButtonsProps = {
  onEdit?: () => void
  onSuspend?: () => void
}

export function MedicationActionButtons({ onEdit, onSuspend }: MedicationActionButtonsProps) {
  if (!onEdit && !onSuspend) return null

  return (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
      {onEdit && (
        <Tooltip title="Editar medicamento" describeChild>
          <IconButton
            size="small"
            color="primary"
            aria-label="Editar medicamento"
            onClick={(event) => { event.stopPropagation(); onEdit() }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}
      {onSuspend && (
        <Tooltip title="Suspender medicamento" describeChild>
          <IconButton
            size="small"
            color="error"
            aria-label="Suspender medicamento"
            onClick={(event) => { event.stopPropagation(); onSuspend() }}
          >
            <StopCircleOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  )
}
