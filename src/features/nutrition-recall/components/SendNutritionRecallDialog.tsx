import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { SearchableSelect } from '@/components/SearchableSelect'
import { usePatients } from '@/features/patients'
import { useSendNutritionRecall } from '../hooks/useNutritionRecallMutations'
import type { SendNutritionRecallResult } from '../types'
import { RecallLinkField } from './RecallLinkField'

type SendNutritionRecallDialogProps = {
  open: boolean
  onClose: () => void
  // Desde el expediente el paciente viene fijo; si no, se elige en el diálogo.
  patientId?: number
}

export function SendNutritionRecallDialog({ open, onClose, patientId }: SendNutritionRecallDialogProps) {
  const { data: patients = [] } = usePatients()
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const [toPatient, setToPatient] = useState(true)
  const [toDoctor, setToDoctor] = useState(true)
  const [result, setResult] = useState<SendNutritionRecallResult | null>(null)
  const sendMutation = useSendNutritionRecall()

  const targetId = patientId ?? selectedId
  const target = patients.find((patient) => patient.id === targetId)

  function handleClose() {
    setSelectedId(undefined)
    setToPatient(true)
    setToDoctor(true)
    setResult(null)
    onClose()
  }

  function handleSend() {
    if (!targetId) return
    sendMutation.mutate(
      { patientId: targetId, sendReportToPatient: toPatient, sendReportToDoctor: toDoctor },
      { onSuccess: setResult },
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Enviar Recordatorio de 24 Horas</DialogTitle>
      <DialogContent>
        {result ? (
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Alert severity="success">
              Copia este enlace y compártelo con el paciente (WhatsApp, SMS, etc.).
            </Alert>
            <RecallLinkField link={result.link} />
          </Stack>
        ) : (
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              El paciente recibirá un enlace para conversar con NutriBot sobre todo lo que comió y bebió
              en un día. Al terminar se genera su reporte nutricional en PDF.
            </Typography>
            {patientId === undefined && (
              <SearchableSelect
                label="Paciente"
                options={patients.map((patient) => ({
                  id: patient.id,
                  label: `${patient.firstName} ${patient.lastName}`.trim(),
                  sublabel: patient.email ?? 'Sin correo registrado',
                }))}
                value={selectedId}
                onChange={setSelectedId}
                required
              />
            )}
            {target && !target.email && (
              <Alert severity="warning">
                El paciente no tiene correo registrado: se generará el enlace para que lo compartas, pero
                no recibirá el PDF por correo.
              </Alert>
            )}
            <FormGroup>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 0.5 }}>
                Envío del reporte PDF al finalizar la entrevista
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={toPatient} onChange={(event) => setToPatient(event.target.checked)} />}
                label="Enviar el PDF al paciente"
              />
              <FormControlLabel
                control={<Checkbox checked={toDoctor} onChange={(event) => setToDoctor(event.target.checked)} />}
                label="Enviar el PDF al equipo de nutrición"
              />
            </FormGroup>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{result ? 'Cerrar' : 'Cancelar'}</Button>
        {!result && (
          <AppButton variant="contained" loading={sendMutation.isPending} disabled={!targetId} onClick={handleSend}>
            Enviar
          </AppButton>
        )}
      </DialogActions>
    </Dialog>
  )
}
