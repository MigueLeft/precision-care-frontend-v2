import { TableRow, TableCell, Typography, Box } from '@mui/material'
import { PatientNameCell } from './PatientNameCell'
import { RowActionsMenu } from './RowActionsMenu'
import { formatBirthDate, calculatePatientAge } from '../utils/patient-format'
import type { Patient } from '../types'

interface PatientRowProps {
  patient: Patient
  nationalityName?: string
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function PatientRow({ patient, nationalityName, onView, onEdit, onDelete }: PatientRowProps) {
  return (
    <TableRow
      hover
      onClick={onView}
      sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
    >
      <TableCell>
        <PatientNameCell patient={patient} />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>{patient.mrn}</Typography>
      </TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ fontSize: '14px' }}>{formatBirthDate(patient.birthDate)}</Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {calculatePatientAge(patient.birthDate)} años
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px', color: nationalityName ? 'text.primary' : 'text.secondary' }}>
          {nationalityName ?? '—'}
        </Typography>
      </TableCell>
      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
        <RowActionsMenu onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  )
}
