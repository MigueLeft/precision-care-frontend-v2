import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'

interface DeleteUserDialogProps {
  open: boolean
  userName: string | undefined
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteUserDialog({ open, userName, isDeleting, onConfirm, onClose }: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar usuario</DialogTitle>
      <DialogContent>
        <DialogContentText>¿Eliminar a {userName}? Esta acción se puede revertir solo desde la papelera de administración.</DialogContentText>
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
