import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { AntecedentBlocks } from './AntecedentBlocks'
import type { Consultation } from '../../types'

type AntecedentsDialogProps = {
  open: boolean
  consultation: Consultation
  onClose: () => void
}

// Captura de antecedentes y alergias desde la barra lateral (consulta
// subsecuente). Cada bloque guarda al instante en el expediente.
export function AntecedentsDialog({ open, consultation, onClose }: AntecedentsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Agregar antecedentes</DialogTitle>
      <DialogContent dividers>
        {open && (
          <AntecedentBlocks
            patientId={consultation.patientId}
            consultationId={consultation.id}
            consultationDate={consultation.startAt}
            readOnly={false}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose}>Listo</Button>
      </DialogActions>
    </Dialog>
  )
}
