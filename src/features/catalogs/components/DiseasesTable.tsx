import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { ToggleActiveButton } from '@/components/ToggleActiveButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { EmptyState } from '@/components/EmptyState'
import type { Disease } from '../types'

interface DiseasesTableProps {
  items: Disease[]
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Nombre', 'Nombre cotidiano', 'Cronicidad', 'Estado', '']

export function DiseasesTable({ items, onEdit, onToggleActive }: DiseasesTableProps) {
  if (items.length === 0) {
    return <EmptyState message="No se encontraron enfermedades con los filtros actuales." />
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
          {items.map((item) => (
            <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {item.commonName || '—'}
              </TableCell>
              <TableCell>
                <Chip
                  label={item.isChronic ? 'Crónica' : 'Aguda'}
                  size="small"
                  color={item.isChronic ? 'warning' : 'default'}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={item.active ? 'Activa' : 'Inactiva'}
                  size="small"
                  color={item.active ? 'success' : 'default'}
                />
              </TableCell>
              {/* Ancho mínimo y sin salto: los botones quedan uno al lado del otro */}
              <TableCell align="right" sx={{ width: '1%', whiteSpace: 'nowrap' }}>
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item.id)}
                      aria-label="Editar enfermedad"
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <ToggleActiveButton active={item.active} onClick={() => onToggleActive(item.id)} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
