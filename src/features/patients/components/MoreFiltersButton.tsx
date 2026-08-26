import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Button, Popover, Box } from '@mui/material'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { EmptyState } from '@/components/EmptyState'

export function MoreFiltersButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  function handleOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<TuneOutlinedIcon sx={{ fontSize: 18 }} />}
        onClick={handleOpen}
        sx={{ borderColor: 'grey.300', color: 'text.primary' }}
      >
        Más filtros
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 260 }}>
          <EmptyState message="Próximamente más filtros." />
        </Box>
      </Popover>
    </>
  )
}
