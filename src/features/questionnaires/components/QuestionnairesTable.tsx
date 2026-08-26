import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { QuestionnaireRow } from './QuestionnaireRow'
import type { Questionnaire } from '../types'

interface QuestionnairesTableProps {
  questionnaires: Questionnaire[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const HEADERS = ['Nombre', 'Tipo', 'Versión', 'Estado', '']

export function QuestionnairesTable({ questionnaires, onEdit, onDelete }: QuestionnairesTableProps) {
  if (questionnaires.length === 0) {
    return <EmptyState message="No se encontraron ingresables con los filtros actuales." />
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
          {questionnaires.map((questionnaire) => (
            <QuestionnaireRow
              key={questionnaire.id}
              questionnaire={questionnaire}
              onEdit={() => onEdit(questionnaire.id)}
              onDelete={() => onDelete(questionnaire.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
