import { useState } from 'react'
import { Stack, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { useIntakeCatalogs } from '../../hooks/useIntakeCatalogs'
import type { QuestionFieldProps } from '../../types'
import { parseEventEntries, toEventListDraft } from '../../utils/event-list'
import { EventEntryList } from './EventEntryList'

const TODAY = new Date().toISOString().slice(0, 10)

// Cirugías u hospitalizaciones previas, capturadas igual que en la consulta:
// procedimiento/motivo del catálogo (o escrito a mano), fecha y complicaciones.
export function EventListField({ question, value, onChange }: QuestionFieldProps) {
  const catalogs = useIntakeCatalogs()
  const isSurgery = question.displayVariant === 'surgery_list'
  const entries = parseEventEntries(value)

  const [event, setEvent] = useState<CatalogPick | null>(null)
  const [date, setDate] = useState('')
  const [complications, setComplications] = useState('')
  // Reinicia el selector (incluida su casilla "escribir manualmente") tras añadir.
  const [pickerKey, setPickerKey] = useState(0)

  function add() {
    const name = event?.name.trim()
    if (!name) {
      toast.error(
        isSurgery
          ? 'Selecciona o escribe el procedimiento.'
          : 'Selecciona o escribe el motivo de la hospitalización.',
      )
      return
    }
    onChange(
      toEventListDraft([
        ...entries,
        { name, date: date || undefined, complications: complications.trim() || undefined },
      ]),
    )
    setEvent(null)
    setDate('')
    setComplications('')
    setPickerKey((key) => key + 1)
  }

  return (
    <Stack spacing={1.5}>
      <EventEntryList
        entries={entries}
        onRemove={(index) => onChange(toEventListDraft(entries.filter((_, i) => i !== index)))}
      />

      {/* El selector va solo en su renglón; fecha, complicaciones y "Añadir" debajo. */}
      <CatalogPicker
        key={pickerKey}
        options={isSurgery ? catalogs.surgeries : catalogs.hospitalizations}
        value={event}
        onChange={setEvent}
        placeholder={isSurgery ? 'Buscar procedimiento…' : 'Buscar motivo…'}
        manualLabel="No está en la lista · escribir manualmente"
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
      >
        <TextField
          size="small"
          type="date"
          label="Fecha"
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: TODAY } }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ width: { xs: '100%', sm: 170 }, flexShrink: 0 }}
        />
        <TextField
          size="small"
          placeholder="Complicaciones…"
          value={complications}
          onChange={(e) => setComplications(e.target.value)}
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
