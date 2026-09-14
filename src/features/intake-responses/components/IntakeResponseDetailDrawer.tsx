import { Drawer, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IntakeResponseDetailContent } from './IntakeResponseDetailContent'

interface IntakeResponseDetailDrawerProps {
  responseId: number | null
  open: boolean
  onClose: () => void
}

export function IntakeResponseDetailDrawer({
  responseId,
  open,
  onClose,
}: IntakeResponseDetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 440 } } }}
    >
      <Box sx={{ p: 3 }}>
        {responseId != null && (
          <IntakeResponseDetailContent
            responseId={responseId}
            headerAction={
              <IconButton size="small" onClick={onClose} aria-label="Cerrar">
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            }
          />
        )}
      </Box>
    </Drawer>
  )
}
