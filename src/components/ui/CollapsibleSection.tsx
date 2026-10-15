import { useContext, useState, type ReactNode } from 'react'
import { Box, Collapse, Paper, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { SectionDensityContext } from './section-density'

interface CollapsibleSectionProps {
  title: string
  /** Contenido a la derecha del título (contador, chip…). */
  headerMeta?: ReactNode
  defaultExpanded?: boolean
  children: ReactNode
}

// Sección plegable tipo "menú desplegable" del expediente (Antecedentes).
export function CollapsibleSection({
  title,
  headerMeta,
  defaultExpanded = false,
  children,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const compact = useContext(SectionDensityContext) === 'compact'

  return (
    <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Stack
        direction="row"
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: compact ? 2 : 3,
          py: compact ? 1 : 2,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography variant={compact ? 'h4' : 'h3'}>{title}</Typography>
          {headerMeta}
        </Stack>
        <ExpandMoreIcon
          sx={{
            color: 'text.secondary',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms',
          }}
        />
      </Stack>
      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: compact ? 2 : 3 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  )
}
