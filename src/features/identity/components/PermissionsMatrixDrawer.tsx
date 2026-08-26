import { Box, CircularProgress, Drawer } from '@mui/material'
import { usePermissions } from '../hooks/usePermissions'
import { PermissionsMatrixDrawerBody } from './PermissionsMatrixDrawerBody'
import type { Role } from '../types'

interface PermissionsMatrixDrawerProps {
  role: Role | null
  onClose: () => void
}

export function PermissionsMatrixDrawer({ role, onClose }: PermissionsMatrixDrawerProps) {
  const { data: permissions = [], isLoading } = usePermissions()

  return (
    <Drawer anchor="right" open={role !== null} onClose={onClose}>
      {role && (isLoading || permissions.length === 0) && (
        <Box sx={{ width: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {role && !isLoading && permissions.length > 0 && (
        <PermissionsMatrixDrawerBody key={role.id} role={role} permissions={permissions} onClose={onClose} />
      )}
    </Drawer>
  )
}
