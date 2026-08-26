import { Box, Typography } from '@mui/material'
import { formatPatientName } from '../utils/patient-format'
import type { Patient } from '../types'

interface PatientNameCellProps {
  patient: Patient
}

export function PatientNameCell({ patient }: PatientNameCellProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }} noWrap>
        {formatPatientName(patient)}
      </Typography>
      {patient.email && (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }} noWrap>
          {patient.email}
        </Typography>
      )}
    </Box>
  )
}
