import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { SearchableSelect } from '@/components/SearchableSelect'
import { useIntakes } from '@/features/intake'
import { useSendIntakeToPatient } from '../hooks/useSendIntakeToPatient'
import type { SendIntakeResult } from '../services/intake-responses.service'

interface SendIntakeDialogProps {
  open: boolean
  patientId: number
  onClose: () => void
}

export function SendIntakeDialog({ open, patientId, onClose }: SendIntakeDialogProps) {
  const { data: intakes = [] } = useIntakes()
  const [intakeId, setIntakeId] = useState<number | undefined>(undefined)
  const [result, setResult] = useState<SendIntakeResult | null>(null)
  const sendMutation = useSendIntakeToPatient(patientId)

  const sendableIntakes = intakes.filter((intake) => intake.active && intake.currentVersionId !== null)
  const selectedIntake = sendableIntakes.find((intake) => intake.id === intakeId)

  function handleClose() {
    setIntakeId(undefined)
    setResult(null)
    onClose()
  }

  function handleSend() {
    if (!selectedIntake?.currentVersionId) return
    sendMutation.mutate(selectedIntake.currentVersionId, {
      onSuccess: (data) => {
        setResult(data)
        toast.success('Enlace generado. Cópialo y compártelo con el paciente.')
      },
      onError: () => {
        toast.error('No se pudo generar el ingresable.')
      },
    })
  }

  async function handleCopyLink() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.link)
      toast.success('Enlace copiado.')
    } catch {
      toast.error('No se pudo copiar el enlace.')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Enviar ingresable</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {!result ? (
            <>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                Selecciona el formulario que quieres enviar al paciente. Se generará un enlace para
                que lo llene sin necesidad de iniciar sesión.
              </Typography>
              <SearchableSelect
                label="Ingresable"
                options={sendableIntakes.map((intake) => ({ id: intake.id, label: intake.name }))}
                value={intakeId}
                onChange={setIntakeId}
                required
              />
            </>
          ) : (
            <>
              <Alert severity="success">
                Copia este enlace y compártelo con el paciente (WhatsApp, SMS, etc.).
              </Alert>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <TextField
                  value={result.link}
                  fullWidth
                  size="small"
                  slotProps={{ input: { readOnly: true } }}
                />
                <Tooltip title="Copiar enlace">
                  <IconButton onClick={handleCopyLink} size="small">
                    <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{result ? 'Cerrar' : 'Cancelar'}</Button>
        {!result && (
          <AppButton
            variant="contained"
            loading={sendMutation.isPending}
            disabled={!intakeId}
            onClick={handleSend}
          >
            Generar enlace
          </AppButton>
        )}
      </DialogActions>
    </Dialog>
  )
}
