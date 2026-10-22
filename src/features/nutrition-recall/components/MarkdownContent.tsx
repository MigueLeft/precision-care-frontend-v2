import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

// Estilos de markdown (párrafos, listas y tablas) para las respuestas de
// NutriBot y para el reporte en el expediente.
const MarkdownRoot = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 1.55,
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
  '& p': { margin: '0 0 8px' },
  '& p:last-child': { marginBottom: 0 },
  '& ul, & ol': { margin: '0 0 8px', paddingLeft: theme.spacing(2.5) },
  '& h2, & h3, & h4': { margin: theme.spacing(1.5, 0, 1), lineHeight: 1.3 },
  '& h2': { fontSize: '17px', color: theme.palette.primary.main },
  '& h3': { fontSize: '15px' },
  '& h4': { fontSize: '14px' },
  '& hr': { border: 0, borderTop: `1px solid ${theme.palette.divider}`, margin: theme.spacing(1.5, 0) },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    margin: theme.spacing(0.5, 0, 1.5),
    fontSize: '12px',
    display: 'block',
    overflowX: 'auto',
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.5, 1),
    textAlign: 'left',
  },
  '& th': { backgroundColor: theme.palette.action.hover, fontWeight: 600 },
}))

type MarkdownContentProps = {
  children: string
}

export function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <MarkdownRoot>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </MarkdownRoot>
  )
}
