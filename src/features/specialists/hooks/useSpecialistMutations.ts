import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  createSpecialist,
  updateSpecialist,
  setSpecialistStatus,
  resendSpecialistInvitation,
} from '../services/specialists.service'
import { specialistsKeys } from './specialists.keys'
import type { CreateSpecialistResult, UpdateSpecialistPayload } from '../types'

function useInvalidate() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({ queryKey: specialistsKeys.all })
}

export function useCreateSpecialist(options?: {
  onSuccess?: (result: CreateSpecialistResult) => void
}) {
  const invalidate = useInvalidate()

  return useMutation({
    mutationFn: createSpecialist,
    onSuccess: (result) => {
      invalidate()
      toast.success(
        `Especialista ${result.specialist.name} ${result.specialist.lastName} creado correctamente`,
      )
      options?.onSuccess?.(result)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el especialista'))
    },
  })
}

export function useUpdateSpecialist(
  id: number | undefined,
  options?: { onSuccess?: () => void },
) {
  const invalidate = useInvalidate()

  return useMutation({
    mutationFn: (payload: UpdateSpecialistPayload) => {
      if (id === undefined) throw new Error('Falta el id del especialista.')
      return updateSpecialist(id, payload)
    },
    onSuccess: () => {
      invalidate()
      toast.success('Especialista actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el especialista'))
    },
  })
}

export function useSetSpecialistStatus(options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidate()

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      setSpecialistStatus(id, active),
    onSuccess: (specialist) => {
      invalidate()
      toast.success(
        specialist.active
          ? 'Especialista activado'
          : 'Especialista desactivado',
      )
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado'))
    },
  })
}

export function useResendSpecialistInvitation() {
  return useMutation({
    mutationFn: resendSpecialistInvitation,
    onSuccess: (result) => {
      toast.success(
        result.sent
          ? 'Invitación reenviada por correo'
          : 'Invitación registrada (correo no configurado en el servidor)',
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al reenviar la invitación'))
    },
  })
}
