import { Paper, Stack, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { AppButton } from '@/components/AppButton'
import { getModuleLabel } from '../utils/module-labels'
import type { Role } from '../types'

const VISIBLE_MODULES = 6

interface RoleCardProps {
  role: Role
  onViewPermissions: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function RoleCard({ role, onViewPermissions, onDuplicate, onDelete }: RoleCardProps) {
  const modules = Array.from(new Set(role.permissions.map((p) => p.module)))
  const visibleModules = modules.slice(0, VISIBLE_MODULES)
  const remaining = modules.length - visibleModules.length

  return (
    <Paper sx={{ p: 3, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>{role.name}</Typography>
          <Chip label={`${role.userCount} usuario${role.userCount === 1 ? '' : 's'}`} size="small" />
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <AppButton size="small" variant="outlined" startIcon={<GridViewOutlinedIcon sx={{ fontSize: 16 }} />} onClick={onViewPermissions}>
            Ver permisos
          </AppButton>
          <Tooltip title="Duplicar">
            <IconButton size="small" onClick={onDuplicate} aria-label="Duplicar rol">
              <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={onDelete} aria-label="Eliminar rol">
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: 'italic' }}>
        {role.description ?? 'Sin descripción'}
      </Typography>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {visibleModules.map((module) => (
          <Chip key={module} label={getModuleLabel(module)} size="small" color="primary" variant="outlined" />
        ))}
        {remaining > 0 && <Chip label={`+${remaining} más`} size="small" variant="outlined" />}
      </Stack>
    </Paper>
  )
}
