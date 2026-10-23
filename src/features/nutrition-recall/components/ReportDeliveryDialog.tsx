import { useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'

type ReportDeliveryDialogProps = {
  open: boolean
  title: string
  confirmLabel: string
  patientEmail: string | null
  // Valor inicial: lo elegido al enviar el recordatorio.
  defaultSendToPatient: boolean
  onConfirm: (sendToPatient: boolean) => void
  onClose: () => void
}

// Antes de generar o reenviar el reporte: el PDF siempre va al equipo de
// nutrición y aquí se decide si también se le envía al paciente.
export function ReportDeliveryDialog(props: ReportDeliveryDialogProps) {
  const { open, title, confirmLabel, patientEmail, defaultSendToPatient, onConfirm, onClose } = props
  const [sendToPatient, setSendToPatient] = useState(defaultSendToPatient && !!patientEmail)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            El PDF del reporte se enviará al equipo de nutrición.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={sendToPatient}
                disabled={!patientEmail}
                onChange={(event) => setSendToPatient(event.target.checked)}
              />
            }
            label={
              patientEmail ? (
                <span>
                  Enviar también al paciente (<strong>{patientEmail}</strong>)
                </span>
              ) : (
                'El paciente no tiene correo registrado'
              )
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <AppButton variant="contained" onClick={() => onConfirm(sendToPatient)}>
          {confirmLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
