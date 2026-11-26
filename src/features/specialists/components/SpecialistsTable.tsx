import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import type { Specialist } from '../types'
import { SpecialistTableRow } from './SpecialistTableRow'

type Props = {
  specialists: Specialist[]
  onView: (id: number) => void
  onToggleStatus: (specialist: Specialist) => void
  onPrice: (specialist: Specialist) => void
}
const HEAD = ['Especialista', 'Especialidad', 'Ubicación', 'Contacto', 'Precio por cita', 'Acceso', 'Estado']
export function SpecialistsTable({ specialists, onView, onToggleStatus, onPrice }: Props) {
  if (!specialists.length) return <EmptyState message="No se encontraron especialistas con los filtros actuales." />
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead><TableRow sx={{ bgcolor: 'grey.50' }}>
          {HEAD.map((label) => <TableCell key={label} sx={{ fontSize: 12, fontWeight: 600, color: 'grey.700' }}>{label}</TableCell>)}
          <TableCell sx={{ position: 'sticky', right: 0, bgcolor: 'grey.50' }} />
        </TableRow></TableHead>
        <TableBody>{specialists.map((s) => <SpecialistTableRow key={s.id} s={s} onView={onView} onToggleStatus={onToggleStatus} onPrice={onPrice} />)}</TableBody>
      </Table>
    </TableContainer>
  )
}
