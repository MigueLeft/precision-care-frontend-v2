import { useState } from 'react'
import type { MouseEvent } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

interface RowActionsMenuProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function RowActionsMenu({ onView, onEdit, onDelete }: RowActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = !!anchorEl

  function handleOpen(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleAction(action: () => void) {
    return (event: MouseEvent) => {
      event.stopPropagation()
      handleClose()
      action()
    }
  }

  return (
    <>
      <IconButton size="small" aria-label="Más acciones" onClick={handleOpen}>
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleAction(onView)}>
          <ListItemIcon>
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Ver</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAction(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAction(onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlineIcon sx={{ fontSize: 18, color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
