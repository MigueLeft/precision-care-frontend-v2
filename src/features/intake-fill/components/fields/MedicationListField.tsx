import { useState } from 'react'
import { IconButton, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { MedicationFrequencyField } from '@/features/patient-medications'
import type { QuestionFieldProps } from '../../types'
import { parseMedicationEntries, toMedicationListDraft } from '../../utils/medication-list'

// Medicamentos que no están en la lista: nombre escrito a mano y su frecuencia,
// igual que en la consulta.
export function MedicationListField({ value, onChange }: QuestionFieldProps) {
  const entries = parseMedicationEntries(value)
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('')
  // Reinicia el selector de frecuencia (cierra el "Otro" abierto) tras añadir.
  const [resetCount, setResetCount] = useState(0)

  function add() {
    if (!name.trim()) {
      toast.error('Escribe el nombre del medicamento.')
      return
    }
    onChange(
      toMedicationListDraft([
        ...entries,
        { name: name.trim(), frequency: frequency.trim() || undefined },
      ]),
    )
    setName('')
    setFrequency('')
    setResetCount((count) => count + 1)
  }

  return (
    <Stack spacing={1.5}>
      {entries.map((entry, index) => (
        <Stack
          key={`${entry.name}-${index}`}
          direction="row"
          spacing={1}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{entry.name}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {entry.frequency ?? 'Sin frecuencia'}
            </Typography>
          </Stack>
          <IconButton
            size="small"
            aria-label="Quitar"
            onClick={() => onChange(toMedicationListDraft(entries.filter((_, i) => i !== index)))}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      ))}

      <TextField
        size="small"
        label="Medicamento"
        placeholder="Nombre del medicamento"
        value={name}
        onChange={(event) => setName(event.target.value)}
        fullWidth
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
      >
        <MedicationFrequencyField
          key={resetCount}
          value={frequency}
          onChange={setFrequency}
          sx={{ flex: 1 }}
        />
        <AppButton
          variant="outlined"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={add}
          sx={{ flexShrink: 0 }}
        >
          Añadir
        </AppButton>
      </Stack>
    </Stack>
  )
}
