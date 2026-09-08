import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { Specialist } from '../types'

interface Props {
  specialist: Specialist | null
  isSubmitting: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeactivateSpecialistDialog({ specialist, isSubmitting, onConfirm, onClose }: Props) {
  const deactivating = specialist?.active ?? true

  return (
    <ConfirmDialog
      open={specialist !== null}
      title={deactivating ? 'Desactivar especialista' : 'Activar especialista'}
      description={
        deactivating
          ? `${specialist?.name ?? ''} ${specialist?.lastName ?? ''} dejará de aparecer en los selectores de agenda. No se elimina el registro y se conservan consultas, recetas y entregables firmados.`
          : `${specialist?.name ?? ''} ${specialist?.lastName ?? ''} volverá a estar disponible en el sistema.`
      }
      confirmLabel={deactivating ? 'Desactivar' : 'Activar'}
      color={deactivating ? 'error' : 'primary'}
      isConfirming={isSubmitting}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
