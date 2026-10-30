import { styled } from '@mui/material/styles'

// Columna de la consulta: en pantallas anchas queda fija al hacer scroll y
// desplaza su propio contenido sin mover la página.
export const WorkspaceColumn = styled('aside')(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  overscrollBehavior: 'contain',
  scrollbarWidth: 'thin',
  [theme.breakpoints.up('lg')]: {
    position: 'sticky',
    top: theme.spacing(2),
    maxHeight: `calc(100vh - ${theme.spacing(4)})`,
    overflowY: 'auto',
  },
}))
