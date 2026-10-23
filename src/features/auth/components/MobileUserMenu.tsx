import { useState, type ReactNode } from 'react'
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined'
import { useNavigate } from '@tanstack/react-router'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { useLogout } from '../hooks/useLogout'
import { useSession } from '../hooks/useSession'

type MobileUserMenuProps = {
  // Opciones extra (p. ej. activar notificaciones), arriba de "Cerrar sesión".
  extraItems?: ReactNode
}

const initialsOf = (name: string | undefined) =>
  (name ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

// Menú del usuario en la app de citas: cuenta, sistema completo y salir.
export function MobileUserMenu({ extraItems }: MobileUserMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { user } = useSession()
  const navigate = useNavigate()
  const { mutate: logout } = useLogout({ onSuccess: () => navigate({ to: '/login', search: { redirect: '/agenda' } }) })
  const close = () => setAnchor(null)

  return (
    <>
      <IconButton onClick={(event) => setAnchor(event.currentTarget)} aria-label="Menú de usuario" sx={{ p: 0.25 }}>
        <InitialsAvatar initials={initialsOf(user?.name)} size={34} />
      </IconButton>
      <Menu anchorEl={anchor} open={!!anchor} onClose={close} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Typography sx={{ px: 2, pt: 1, fontSize: '14px', fontWeight: 600 }}>{user?.name}</Typography>
        <Typography sx={{ px: 2, pb: 1, fontSize: '12px', color: 'text.secondary' }}>{user?.email}</Typography>
        <Divider />
        {extraItems}
        <MenuItem onClick={() => { close(); void navigate({ to: '/mi-cuenta' }) }}>
          <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Mi cuenta</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { close(); void navigate({ to: '/citas' }) }}>
          <ListItemIcon><DesktopWindowsOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Abrir sistema completo</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { close(); logout() }}>
          <ListItemIcon><LogoutOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Cerrar sesión</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
