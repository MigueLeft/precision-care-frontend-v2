import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import { useNavigate } from '@tanstack/react-router'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { EmptyState } from '@/components/EmptyState'
import type { Specialist } from '../types'
import {
  formatSpecialistInitials,
  formatSpecialistLocation,
  formatSpecialistLocationSub,
} from '../utils/specialist-format'

interface Props {
  specialists: Specialist[]
  onView: (id: number) => void
  onToggleStatus: (specialist: Specialist) => void
}

const HEAD = ['Especialista', 'Especialidad', 'Ubicación', 'Contacto', 'Acceso', 'Estado', '']

export function SpecialistsTable({ specialists, onView, onToggleStatus }: Props) {
  const navigate = useNavigate()

  if (specialists.length === 0) {
    return <EmptyState message="No se encontraron especialistas con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEAD.map((label, i) => (
              <TableCell key={label || i} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {specialists.map((s) => (
            <TableRow
              key={s.id}
              hover
              sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
              onClick={() => onView(s.id)}
            >
              <TableCell>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <InitialsAvatar initials={formatSpecialistInitials(s)} size={36} />
                  <div>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                      {s.name} {s.lastName}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {s.patientsCount} pacientes
                    </Typography>
                  </div>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '14px' }}>{s.primarySpecialtyName ?? '—'}</Typography>
                {s.otherSpecialties.length > 0 && (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    + {s.otherSpecialties.map((o) => o.name).join(', ')}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '14px' }}>{formatSpecialistLocation(s)}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {formatSpecialistLocationSub(s)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '14px' }}>{s.email}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {s.phone ?? 'Sin teléfono'}
                </Typography>
              </TableCell>
              <TableCell>
                {s.hasUser ? (
                  <Chip label={s.roleName ?? 'Usuario'} size="small" color="info" variant="outlined" />
                ) : (
                  <Chip label="Sin usuario" size="small" color="warning" variant="outlined" />
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={s.active ? 'Activo' : 'Desactivado'}
                  size="small"
                  color={s.active ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    aria-label="Editar especialista"
                    onClick={() =>
                      navigate({
                        to: '/especialistas/$specialistId/editar',
                        params: { specialistId: String(s.id) },
                      })
                    }
                  >
                    <EditOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={s.active ? 'Desactivar' : 'Activar'}>
                  <IconButton
                    size="small"
                    aria-label={s.active ? 'Desactivar especialista' : 'Activar especialista'}
                    onClick={() => onToggleStatus(s)}
                  >
                    {s.active ? (
                      <PersonOffOutlinedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <PersonAddAlt1OutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
