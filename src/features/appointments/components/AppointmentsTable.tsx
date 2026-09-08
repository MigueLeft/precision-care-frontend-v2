import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { AppointmentRow } from './AppointmentRow'
import type { Appointment } from '../types'

interface AppointmentsTableProps {
  appointments: Appointment[]
  onView: (id: number) => void
}

const HEADERS = ['Fecha y hora', 'Paciente', 'Especialista', 'Modalidad', 'Motivo', 'Estado', '']

export function AppointmentsTable({ appointments, onView }: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return <EmptyState message="No hay citas con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEADERS.map((header, index) => (
              <TableCell
                key={`${header}-${index}`}
                sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              onView={() => onView(appointment.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
