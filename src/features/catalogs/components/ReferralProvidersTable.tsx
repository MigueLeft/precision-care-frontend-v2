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
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { ToggleActiveButton } from '@/components/ToggleActiveButton'
import { EmptyState } from '@/components/EmptyState'
import type { ReferralProvider } from '../types'

type ReferralProvidersTableProps = {
  providers: ReferralProvider[]
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Centro o especialista', 'Dirección', 'Teléfonos', 'Estado', '']
const cellText = { fontSize: '13px', color: 'text.secondary' }

export function ReferralProvidersTable({ providers, onEdit, onToggleActive }: ReferralProvidersTableProps) {
  if (providers.length === 0) {
    return <EmptyState message="No se encontraron centros de referencia." />
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
          {providers.map((provider) => (
            <TableRow key={provider.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ minWidth: 200 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{provider.name}</Typography>
                {provider.specialty && <Typography sx={cellText}>{provider.specialty}</Typography>}
              </TableCell>
              <TableCell>
                <Typography sx={cellText}>{provider.address ?? '—'}</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={cellText}>{provider.phone ?? '—'}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={provider.active ? 'Activo' : 'Inactivo'}
                  size="small"
                  color={provider.active ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell align="right" sx={{ width: '1%', whiteSpace: 'nowrap' }}>
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => onEdit(provider.id)} aria-label="Editar centro">
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <ToggleActiveButton active={provider.active} onClick={() => onToggleActive(provider.id)} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
