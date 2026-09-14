import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'

interface DeleteIntakeDialogProps {
  open: boolean
  intakeName: string | undefined
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteIntakeDialog({
  open,
  intakeName,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteIntakeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar ingresable</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Eliminar el ingresable {intakeName}? Dejará de estar disponible pero se conserva en el
          histórico.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancelar
        </Button>
        <AppButton variant="contained" color="error" loading={isDeleting} onClick={onConfirm}>
          Eliminar
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
