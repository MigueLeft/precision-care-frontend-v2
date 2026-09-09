import type { ReactNode } from 'react'
import {
  Box,
  Table,
  TableCell,
  type SxProps,
  type TableCellProps,
  type Theme,
} from '@mui/material'

// Estilo de tabla de datos clínicos (composición corporal, examen físico).
// Encabezado gris claro, bordes finos, celdas calculadas resaltadas en azul.

const HEADER_BG = '#f8fafc'
const CALC_BG = '#eef4fb'

interface DataTableProps {
  children: ReactNode
  /** Ancho mínimo para forzar scroll horizontal en pantallas chicas. */
  minWidth?: number
  sx?: SxProps<Theme>
}

export function DataTable({ children, minWidth, sx }: DataTableProps) {
  return (
    <Box
      sx={{
        overflowX: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth,
          '& td, & th': {
            borderColor: 'divider',
            fontSize: '13px',
          },
          ...sx,
        }}
      >
        {children}
      </Table>
    </Box>
  )
}

// Celda de encabezado con el fondo gris claro del diseño.
export function HeadCell({ sx, ...props }: TableCellProps) {
  return (
    <TableCell
      {...props}
      sx={{
        bgcolor: HEADER_BG,
        color: 'grey.700',
        fontWeight: 600,
        fontSize: '12px',
        whiteSpace: 'nowrap',
        ...sx,
      }}
    />
  )
}

interface DataCellProps extends TableCellProps {
  /** Valor derivado/calculado: se resalta en azul y en negrita. */
  calc?: boolean
}

export function DataCell({ calc, sx, ...props }: DataCellProps) {
  return (
    <TableCell
      {...props}
      sx={{
        ...(calc
          ? { bgcolor: CALC_BG, fontWeight: 700, color: 'primary.dark' }
          : null),
        ...sx,
      }}
    />
  )
}
