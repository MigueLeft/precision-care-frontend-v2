import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { AppButton } from '@/components/AppButton'

// Nombre del registro elegido en grande con su código debajo.
export function CaptureHeader({ name, code }: { name: string; code?: string | null }) {
  return (
    <Stack spacing={0.25} sx={{ py: 0.5 }}>
      <Typography sx={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.25 }}>{name}</Typography>
      {code && <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', letterSpacing: '0.03em' }}>{code}</Typography>}
    </Stack>
  )
}

// Campo del panel de captura con su etiqueta arriba.
export function CaptureField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack spacing={0.75}>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
      {children}
    </Stack>
  )
}

type CaptureActionsProps = {
  editing: boolean
  loading: boolean
  onSubmit: () => void
  onCancel?: () => void
  addLabel?: string
}

// Botón final del panel: "Agregar" para un registro nuevo, "Guardar cambios" al editar.
export function CaptureActions({ editing, loading, onSubmit, onCancel, addLabel = 'Agregar' }: CaptureActionsProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
      {onCancel && (
        <AppButton variant="text" onClick={onCancel} disabled={loading}>
          Cancelar
        </AppButton>
      )}
      <AppButton
        variant="contained"
        fullWidth
        loading={loading}
        startIcon={editing ? <SaveOutlinedIcon sx={{ fontSize: 18 }} /> : <AddIcon sx={{ fontSize: 18 }} />}
        onClick={onSubmit}
      >
        {editing ? 'Guardar cambios' : addLabel}
      </AppButton>
    </Stack>
  )
}
