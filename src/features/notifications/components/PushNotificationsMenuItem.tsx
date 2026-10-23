import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined'
import { usePushNotifications } from '../hooks/usePushNotifications'

const SECONDARY: Record<string, string> = {
  'needs-install': 'Instala la app en tu pantalla de inicio',
  blocked: 'Bloqueadas en los ajustes',
  unsupported: 'No disponibles en este navegador',
}

// Activar / desactivar las notificaciones de este dispositivo (menú de usuario).
export function PushNotificationsMenuItem() {
  const { status, enable, disable, busy } = usePushNotifications()
  const on = status === 'on'
  const actionable = status === 'on' || status === 'off'

  return (
    <MenuItem
      disabled={!actionable || busy}
      onClick={() => (on ? disable.mutate() : enable.mutate())}
    >
      <ListItemIcon>
        {on ? <NotificationsOffOutlinedIcon fontSize="small" /> : <NotificationsActiveOutlinedIcon fontSize="small" />}
      </ListItemIcon>
      <ListItemText
        primary={on ? 'Desactivar notificaciones' : 'Activar notificaciones'}
        secondary={SECONDARY[status]}
      />
    </MenuItem>
  )
}
