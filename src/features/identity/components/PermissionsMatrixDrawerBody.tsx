import { useState } from 'react'
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Stack } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { PermissionMatrixRow } from './PermissionMatrixRow'
import { useSetRolePermissions } from '../hooks/useSetRolePermissions'
import {
  MATRIX_ACTIONS,
  buildInitialMatrix,
  computePermissionIds,
  getOrderedModules,
  matrixKey,
} from '../utils/permission-matrix'
import { getActionLabel } from '../utils/module-labels'
import type { Permission, Role } from '../types'

interface PermissionsMatrixDrawerBodyProps {
  role: Role
  permissions: Permission[]
  onClose: () => void
}

export function PermissionsMatrixDrawerBody({ role, permissions, onClose }: PermissionsMatrixDrawerBodyProps) {
  const [matrix, setMatrix] = useState(() => buildInitialMatrix(role, permissions))
  const modules = getOrderedModules(permissions)
  const setPermissionsMutation = useSetRolePermissions(role.id, { onSuccess: onClose })

  function handleToggle(module: string, action: (typeof MATRIX_ACTIONS)[number]) {
    const key = matrixKey(module, action)
    setMatrix((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSave() {
    setPermissionsMutation.mutate(computePermissionIds(matrix, permissions))
  }

  return (
    <Box sx={{ width: 640, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>{role.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {role.description ?? 'Sin descripción'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Marca la casilla para otorgar el permiso, desmárcala para quitarlo.
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Módulo</TableCell>
              {MATRIX_ACTIONS.map((action) => (
                <TableCell key={action} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                  {getActionLabel(action)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((module) => (
              <PermissionMatrixRow key={module} module={module} matrix={matrix} onToggle={handleToggle} />
            ))}
          </TableBody>
        </Table>
      </Box>

      <Stack direction="row" spacing={1} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} disabled={setPermissionsMutation.isPending}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={setPermissionsMutation.isPending} onClick={handleSave}>
          Guardar cambios
        </AppButton>
      </Stack>
    </Box>
  )
}
