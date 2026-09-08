import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import type { PatientMedication } from '../types'
import { getMedicationDisplayName } from '../utils/medication-helpers'

interface SuspendMedicationDialogProps {
  // Se monta solo cuando hay un medicamento seleccionado (el estado se
  // reinicia de forma natural al montar/desmontar).
  medication: PatientMedication
  isSubmitting: boolean
  onConfirm: (reason: string) => void
  onClose: () => void
}

export function SuspendMedicationDialog({
  medication,
  isSubmitting,
  onConfirm,
  onClose,
}: SuspendMedicationDialogProps) {
  const [reason, setReason] = useState('')

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Suspender medicamento</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Suspender &quot;{getMedicationDisplayName(medication)}&quot;. Pasará a
          &quot;Medicamentos previos&quot;.
        </DialogContentText>
        <TextField
          label="Motivo de suspensión"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          multiline
          minRows={2}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton
          variant="contained"
          color="error"
          loading={isSubmitting}
          onClick={() => onConfirm(reason.trim())}
        >
          Suspender
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
