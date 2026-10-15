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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { EmptyState } from '@/components/EmptyState'
import type { LabProfile } from '../types'

type LabProfilesTableProps = {
  profiles: LabProfile[]
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Perfil', 'Estudios', 'Estado', '']
// Estudios visibles como chip antes de resumir con "+N".
const VISIBLE_STUDIES = 6

export function LabProfilesTable({ profiles, onEdit, onToggleActive }: LabProfilesTableProps) {
  if (profiles.length === 0) {
    return <EmptyState message="No se encontraron perfiles de laboratorio." />
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
          {profiles.map((profile) => {
            const hidden = profile.items.length - VISIBLE_STUDIES
            return (
              <TableRow key={profile.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ minWidth: 200 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{profile.name}</Typography>
                  {profile.description && (
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {profile.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                    {profile.items.slice(0, VISIBLE_STUDIES).map((item) => (
                      <Chip
                        key={item.id}
                        label={item.name}
                        size="small"
                        variant="outlined"
                        color={item.active ? 'info' : 'default'}
                      />
                    ))}
                    {hidden > 0 && <Chip label={`+${hidden}`} size="small" />}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={profile.active ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={profile.active ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right" sx={{ width: '1%', whiteSpace: 'nowrap' }}>
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => onEdit(profile.id)} aria-label="Editar perfil">
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={profile.active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        onClick={() => onToggleActive(profile.id)}
                        aria-label="Cambiar estado del perfil"
                      >
                        <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
