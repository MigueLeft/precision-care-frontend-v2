import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { sendIntakeEmail } from '../services/intake-responses.service'

// Reenvía por correo el enlace de un formulario pendiente.
export function useSendIntakeEmail() {
  return useMutation({
    mutationFn: sendIntakeEmail,
    onSuccess: ({ sent, email }) => {
      if (sent) toast.success(`Formulario enviado a ${email}`)
      else toast.warning('El correo no está configurado (SMTP); copia el enlace y compártelo.')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo enviar el formulario por correo.'))
    },
  })
}
