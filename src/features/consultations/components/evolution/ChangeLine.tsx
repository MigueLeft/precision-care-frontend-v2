import { Chip, Stack, Typography } from '@mui/material'

export type ChangeTone = 'success' | 'error' | 'info' | 'warning' | 'default'

type ChangeLineProps = {
  tag: string
  tone: ChangeTone
  title: string
  detail?: React.ReactNode
}

// Una línea de la nota evolutiva: etiqueta de tipo de cambio + qué cambió.
export function ChangeLine({ tag, tone, title, detail }: ChangeLineProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
      <Chip size="small" color={tone} variant="outlined" label={tag} sx={{ flexShrink: 0 }} />
      <Typography sx={{ fontSize: '13px' }}>
        <strong>{title}</strong>
        {detail ? <> · {detail}</> : null}
      </Typography>
    </Stack>
  )
}

// "antes → después" con el valor nuevo resaltado.
export function Transition({ before, after }: { before: string; after: string }) {
  return (
    <>
      <span>{before}</span> → <strong>{after}</strong>
    </>
  )
}
