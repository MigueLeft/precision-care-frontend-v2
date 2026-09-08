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

const HEAD = ['Especialista', 'Especialidad', 'Ubicación', 'Contacto', 'Acceso', 'Estado']

// Celda de acciones fija a la derecha para que Editar/Desactivar sigan visibles
// aunque la tabla necesite scroll horizontal.
const stickyActions = {
  position: 'sticky',
  right: 0,
  bgcolor: 'background.paper',
  borderLeft: '1px solid',
  borderColor: 'divider',
} as const

const ellipsis = {
  maxWidth: 220,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const

export function SpecialistsTable({ specialists, onView, onToggleStatus }: Props) {
  const navigate = useNavigate()

  if (specialists.length === 0) {
    return <EmptyState message="No se encontraron especialistas con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEAD.map((label) => (
              <TableCell key={label} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                {label}
              </TableCell>
            ))}
            <TableCell sx={{ ...stickyActions, bgcolor: 'grey.50' }} />
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
                  <InitialsAvatar initials={formatSpecialistInitials(s)} size={32} />
                  <div>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, ...ellipsis }} title={`${s.name} ${s.lastName}`}>
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
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary', ...ellipsis }}>
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
                <Typography sx={{ fontSize: '14px', ...ellipsis }} title={s.email}>
                  {s.email}
                </Typography>
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
              <TableCell align="right" sx={stickyActions} onClick={(event) => event.stopPropagation()}>
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
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
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
