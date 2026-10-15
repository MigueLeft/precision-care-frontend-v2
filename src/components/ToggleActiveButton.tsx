import { IconButton, Tooltip } from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined'

type ToggleActiveButtonProps = {
  active: boolean
  onClick: () => void
  // Para lectores de pantalla, ej. "la enfermedad".
  itemLabel?: string
}

// Desactivar un registro de catálogo o, si ya está inactivo, reactivarlo.
export function ToggleActiveButton({ active, onClick, itemLabel = 'el registro' }: ToggleActiveButtonProps) {
  return (
    <Tooltip title={active ? 'Desactivar' : 'Reactivar'}>
      <IconButton
        size="small"
        color={active ? 'default' : 'success'}
        onClick={onClick}
        aria-label={`${active ? 'Desactivar' : 'Reactivar'} ${itemLabel}`}
      >
        {active ? (
          <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
        ) : (
          <RestoreOutlinedIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>
    </Tooltip>
  )
}
