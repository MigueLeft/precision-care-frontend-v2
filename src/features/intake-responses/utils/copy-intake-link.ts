import { toast } from 'sonner'

// Copia el enlace público de un ingresable pendiente para compartirlo con el
// paciente (WhatsApp, SMS, etc.).
export async function copyIntakeLink(link: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(link)
    toast.success('Enlace copiado.')
  } catch {
    toast.error('No se pudo copiar el enlace.')
  }
}
