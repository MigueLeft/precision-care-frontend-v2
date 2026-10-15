import { Stack } from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import MailOutlineIcon from '@mui/icons-material/EmailOutlined'
import { AppButton } from '@/components/AppButton'
import { useSendIntakeEmail } from '../hooks/useSendIntakeEmail'
import { copyIntakeLink } from '../utils/copy-intake-link'

type PendingIntakeActionsProps = {
  responseId: number
  link: string | null
}

// Formulario pendiente: copiar el enlace o reenviarlo al correo del paciente.
export function PendingIntakeActions({ responseId, link }: PendingIntakeActionsProps) {
  const sendEmail = useSendIntakeEmail()

  return (
    <Stack direction="row" spacing={1}>
      <AppButton
        size="small"
        variant="outlined"
        startIcon={<ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />}
        disabled={!link}
        onClick={() => link && copyIntakeLink(link)}
      >
        Copiar enlace
      </AppButton>
      <AppButton
        size="small"
        variant="outlined"
        startIcon={<MailOutlineIcon sx={{ fontSize: 16 }} />}
        loading={sendEmail.isPending}
        onClick={() => sendEmail.mutate(responseId)}
      >
        Enviar por correo
      </AppButton>
    </Stack>
  )
}
