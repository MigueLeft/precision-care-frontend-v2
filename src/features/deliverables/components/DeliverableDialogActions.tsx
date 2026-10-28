import { DialogActions, Typography } from '@mui/material'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { AppButton } from '@/components/AppButton'

type DeliverableDialogActionsProps = {
  readOnly: boolean
  // Hay cambios sin guardar.
  dirty: boolean
  // Lo guardado tiene contenido (se puede imprimir).
  hasSaved: boolean
  canSave: boolean
  saving: boolean
  printing: boolean
  onClose: () => void
  onSave: () => void
  onPrint: () => void
}

// Guardar reemplaza la orden/receta de la consulta; imprimir solo se ofrece
// cuando lo que se ve ya está guardado.
export function DeliverableDialogActions({
  readOnly,
  dirty,
  hasSaved,
  canSave,
  saving,
  printing,
  onClose,
  onSave,
  onPrint,
}: DeliverableDialogActionsProps) {
  return (
    <DialogActions sx={{ px: 3, pb: 2 }}>
      {dirty && (
        <Typography sx={{ fontSize: '12px', color: 'warning.main', mr: 'auto' }}>
          Cambios sin guardar: guarda para poder imprimir.
        </Typography>
      )}
      <AppButton variant="text" onClick={onClose} disabled={saving || printing}>
        {dirty ? 'Descartar y cerrar' : 'Cerrar'}
      </AppButton>
      {!readOnly && (
        <AppButton
          variant={dirty ? 'contained' : 'outlined'}
          startIcon={<SaveOutlinedIcon sx={{ fontSize: 18 }} />}
          disabled={!dirty || !canSave}
          loading={saving}
          onClick={onSave}
        >
          Guardar
        </AppButton>
      )}
      {!dirty && hasSaved && (
        <AppButton
          variant="contained"
          startIcon={<PrintOutlinedIcon sx={{ fontSize: 18 }} />}
          loading={printing}
          onClick={onPrint}
        >
          Imprimir
        </AppButton>
      )}
    </DialogActions>
  )
}
