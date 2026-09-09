import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  createSpecialist,
  updateSpecialist,
  setSpecialistStatus,
  addSpecialistUser,
  resendSpecialistInvitation,
} from '../services/specialists.service'
import { specialistsKeys } from './specialists.keys'
import type {
  CreateSpecialistResult,
  Specialist,
  SpecialistUserInput,
  UpdateSpecialistPayload,
} from '../types'

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

export function useAddSpecialistUser(
  id: number | undefined,
  options?: { onSuccess?: (result: CreateSpecialistResult) => void },
) {
  const invalidate = useInvalidate()

  return useMutation({
    mutationFn: (payload: SpecialistUserInput) => {
      if (id === undefined) throw new Error('Falta el id del especialista.')
      return addSpecialistUser(id, payload)
    },
    onSuccess: (result) => {
      invalidate()
      toast.success('Usuario de acceso creado correctamente')
      options?.onSuccess?.(result)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el usuario de acceso'))
    },
  })
}

export function useSetSpecialistStatus(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const invalidate = useInvalidate()

  function patchCaches(id: number, active: boolean) {
    queryClient.setQueryData<Specialist[]>(specialistsKeys.lists(), (list) =>
      list?.map((s) => (s.id === id ? { ...s, active } : s)),
    )
    queryClient.setQueryData<Specialist>(specialistsKeys.detail(id), (s) =>
      s ? { ...s, active } : s,
    )
  }

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      setSpecialistStatus(id, active),
    // Refleja el cambio en la UI de inmediato; se reconcilia con la respuesta real.
    onMutate: ({ id, active }) => patchCaches(id, active),
    onSuccess: (specialist) => {
      patchCaches(specialist.id, specialist.active)
      invalidate()
      toast.success(
        specialist.active
          ? 'Especialista activado'
          : 'Especialista desactivado',
      )
      options?.onSuccess?.()
    },
    onError: (error, { id, active }) => {
      patchCaches(id, !active)
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
