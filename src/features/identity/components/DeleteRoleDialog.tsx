import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'

interface DeleteRoleDialogProps {
  open: boolean
  roleName: string | undefined
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteRoleDialog({ open, roleName, isDeleting, onConfirm, onClose }: DeleteRoleDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar rol</DialogTitle>
      <DialogContent>
        <DialogContentText>¿Eliminar el rol {roleName}? Los usuarios que lo tengan asignado quedarán sin rol.</DialogContentText>
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
