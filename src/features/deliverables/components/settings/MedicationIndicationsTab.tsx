import { useState } from 'react'
import { Stack, TableBody, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { DataTable, HeadCell } from '@/components/ui/DataTable'
import { useMedicationPresentations, useMedications } from '@/features/catalogs'
import { MedicationIndicationRow } from './MedicationIndicationRow'

// Indicaciones predefinidas por medicamento para la hoja de indicaciones del récipe.
export function MedicationIndicationsTab() {
  const { data: medications = [] } = useMedications()
  const { data: presentations = [] } = useMedicationPresentations()
  const [search, setSearch] = useState('')

  const presentationName = new Map(presentations.map((item) => [item.id, item.name]))
  const term = search.trim().toLowerCase()
  const visible = medications
    .filter((medication) => medication.active)
    .filter(
      (medication) =>
        !term ||
        medication.brandName.toLowerCase().includes(term) ||
        medication.genericName.toLowerCase().includes(term),
    )
    .sort((a, b) => a.brandName.localeCompare(b.brandName, 'es'))

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        El texto se precarga en el récipe al recetar el medicamento y se puede ajustar en cada
        consulta.
      </Typography>
      <TextField
        size="small"
        placeholder="Buscar medicamento…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ maxWidth: 320 }}
      />
      <DataTable minWidth={720}>
        <TableHead>
          <TableRow>
            <HeadCell>Medicamento</HeadCell>
            <HeadCell>Indicación predefinida</HeadCell>
            <HeadCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((medication) => (
            <MedicationIndicationRow
              key={`${medication.id}-${medication.defaultIndication ?? ''}`}
              medication={medication}
              presentation={[presentationName.get(medication.presentationId), medication.concentration]
                .filter(Boolean)
                .join(' ')}
            />
          ))}
        </TableBody>
      </DataTable>
    </Stack>
  )
}
