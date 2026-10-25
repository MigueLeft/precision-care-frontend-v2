import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import type { PhysicalExam } from '../types'

type NarrativePanelProps = {
  exam: PhysicalExam
  readOnly: boolean
  onEdit: (text: string) => void
  onReset: () => void
}

// Vista previa de la narrativa (en vivo). El médico puede editarla: se guardan
// la generada y la editada, con la bandera narrativaEditada.
export function NarrativePanel({ exam, readOnly, onEdit, onReset }: NarrativePanelProps) {
  const [editing, setEditing] = useState(false)
  const outdated = exam.narrativaEditada && exam.narrativaFinal !== exam.narrativaGenerada

  return (
    <Paper sx={{ p: 1.5, borderRadius: '8px', position: { md: 'sticky' }, top: { md: 16 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', mb: 1 }}>
        <Typography sx={{ flex: 1, fontSize: '13px', fontWeight: 700 }}>Narrativa del examen físico</Typography>
        {!readOnly && !editing && (
          <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />} onClick={() => setEditing(true)}>
            Editar
          </Button>
        )}
        {!readOnly && editing && (
          <Button size="small" onClick={() => setEditing(false)}>
            Listo
          </Button>
        )}
      </Stack>

      {exam.narrativaEditada && outdated && (
        <Alert
          severity="info"
          sx={{ mb: 1, py: 0, '& .MuiAlert-message': { fontSize: '12px' } }}
          action={
            !readOnly && (
              <Button size="small" color="inherit" startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />} onClick={onReset}>
                Usar generado
              </Button>
            )
          }
        >
          Texto editado a mano: no se actualiza con los cambios del formulario.
        </Alert>
      )}

      {editing ? (
        <TextField multiline minRows={10} fullWidth size="small" value={exam.narrativaFinal} onChange={(event) => onEdit(event.target.value)} />
      ) : (
        <Typography sx={{ fontSize: '12.5px', whiteSpace: 'pre-line', color: exam.narrativaFinal ? 'text.primary' : 'text.secondary' }}>
          {exam.narrativaFinal || 'Documenta los sistemas para generar la narrativa.'}
        </Typography>
      )}
    </Paper>
  )
}
