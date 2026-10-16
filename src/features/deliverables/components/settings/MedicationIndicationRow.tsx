import { useState } from 'react'
import { IconButton, Stack, TableRow, TextField, Tooltip } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { DataCell } from '@/components/ui/DataTable'
import { useUpdateMedication, type Medication } from '@/features/catalogs'

type MedicationIndicationRowProps = {
  medication: Medication
  presentation: string
}

// Indicación predefinida de un medicamento: se precarga en el récipe y se puede
// ajustar al recetar.
export function MedicationIndicationRow({ medication, presentation }: MedicationIndicationRowProps) {
  const [value, setValue] = useState(medication.defaultIndication ?? '')
  const update = useUpdateMedication(medication.id)
  const dirty = value.trim() !== (medication.defaultIndication ?? '')

  return (
    <TableRow>
      <DataCell sx={{ width: 240 }}>
        <Stack>
          <strong>{medication.brandName}</strong>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {[medication.genericName !== medication.brandName ? medication.genericName : '', presentation]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </Stack>
      </DataCell>
      <DataCell>
        <TextField
          size="small"
          placeholder="Ej.: Tomar 1 tableta cada 8 horas después del almuerzo"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          multiline
          fullWidth
        />
      </DataCell>
      <DataCell align="right" sx={{ width: 56 }}>
        <Tooltip title="Guardar indicación">
          <span>
            <IconButton
              size="small"
              color="primary"
              disabled={!dirty || update.isPending}
              onClick={() => update.mutate({ defaultIndication: value.trim() || null })}
            >
              <SaveIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </DataCell>
    </TableRow>
  )
}
