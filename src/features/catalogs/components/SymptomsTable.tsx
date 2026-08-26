import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { SymptomRow } from './SymptomRow'
import type { SymptomCatalog } from '../types'

interface SymptomsTableProps {
  symptoms: SymptomCatalog[]
  bodySystemNameById: Map<number, string>
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Nombre', 'CIE-10', 'Aparato / sistema', 'Estado', '']

export function SymptomsTable({ symptoms, bodySystemNameById, onEdit, onToggleActive }: SymptomsTableProps) {
  if (symptoms.length === 0) {
    return <EmptyState message="No se encontraron síntomas con los filtros actuales." />
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
          {symptoms.map((symptom) => (
            <SymptomRow
              key={symptom.id}
              symptom={symptom}
              bodySystemName={symptom.bodySystemId ? bodySystemNameById.get(symptom.bodySystemId) : undefined}
              onEdit={() => onEdit(symptom.id)}
              onToggleActive={() => onToggleActive(symptom.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
