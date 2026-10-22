import { IconButton, Stack, TextField, Tooltip } from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import { copyIntakeLink } from '@/features/intake-responses'

type RecallLinkFieldProps = {
  link: string
}

// Enlace público de solo lectura con botón para copiarlo.
export function RecallLinkField({ link }: RecallLinkFieldProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <TextField value={link} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
      <Tooltip title="Copiar enlace">
        <IconButton onClick={() => void copyIntakeLink(link)} size="small">
          <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
