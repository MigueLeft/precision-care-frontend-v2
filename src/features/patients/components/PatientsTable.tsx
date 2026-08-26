import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { PatientRow } from './PatientRow'
import type { Patient } from '../types'

interface PatientsTableProps {
  patients: Patient[]
  countryNameById: Map<number, string>
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const HEADERS = ['Paciente', 'MRN', 'F. nacimiento', 'Nacionalidad', '']

export function PatientsTable({ patients, countryNameById, onView, onEdit, onDelete }: PatientsTableProps) {
  if (patients.length === 0) {
    return <EmptyState message="No se encontraron pacientes con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEADERS.map((header) => (
              <TableCell key={header} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              nationalityName={
                patient.nationalityCountryId
                  ? countryNameById.get(patient.nationalityCountryId)
                  : undefined
              }
              onView={() => onView(patient.id)}
              onEdit={() => onEdit(patient.id)}
              onDelete={() => onDelete(patient.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
