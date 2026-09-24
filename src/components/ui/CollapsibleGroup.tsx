import { useState, type ReactNode } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface CollapsibleGroupProps {
  title: string
  /** Contenido a la derecha del título (contador, chip…). */
  headerMeta?: ReactNode
  defaultExpanded?: boolean
  children: ReactNode
}

// Desplegable ligero para anidar dentro de un CollapsibleSection
// (p. ej. una categoría de paraclínicos dentro de la sección Paraclínicos).
export function CollapsibleGroup({
  title,
  headerMeta,
  defaultExpanded = false,
  children,
}: CollapsibleGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
      <Stack
        direction="row"
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          cursor: 'pointer',
          userSelect: 'none',
          bgcolor: 'grey.50',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{title}</Typography>
          {headerMeta}
        </Stack>
        <ExpandMoreIcon
          sx={{
            fontSize: 20,
            color: 'text.secondary',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms',
          }}
        />
      </Stack>
      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1.5 }}>{children}</Box>
      </Collapse>
    </Box>
  )
}
