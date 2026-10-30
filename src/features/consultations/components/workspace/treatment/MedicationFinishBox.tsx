import { useState } from 'react'
import { Stack, TextField } from '@mui/material'
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined'
import { AppButton } from '@/components/AppButton'

type MedicationFinishBoxProps = {
  loading: boolean
  onFinish: (reason: string) => void
}

// Finalizar el tratamiento (con motivo opcional) desde el panel de captura.
export function MedicationFinishBox({ loading, onFinish }: MedicationFinishBoxProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  if (!open) {
    return (
      <AppButton
        variant="text"
        color="error"
        startIcon={<StopCircleOutlinedIcon sx={{ fontSize: 16 }} />}
        onClick={() => setOpen(true)}
        sx={{ alignSelf: 'flex-start' }}
      >
        Finalizar tratamiento
      </AppButton>
    )
  }

  return (
    <Stack spacing={1} sx={{ p: 1.25, borderRadius: 1, bgcolor: 'action.hover' }}>
      <TextField
        size="small"
        label="Motivo (opcional)"
        placeholder="Fin de esquema, sin indicación…"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      <Stack direction="row" spacing={1}>
        <AppButton size="small" variant="contained" color="error" loading={loading} onClick={() => onFinish(reason.trim() || 'Tratamiento finalizado')}>
          Finalizar tratamiento
        </AppButton>
        <AppButton size="small" variant="text" onClick={() => setOpen(false)}>
          Cancelar
        </AppButton>
      </Stack>
    </Stack>
  )
}
