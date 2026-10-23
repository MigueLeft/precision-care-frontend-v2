import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { deletePushSubscription, fetchPushPublicKey, savePushSubscription } from '../services/push.service'
import { isPushSupported, needsInstallForPush, urlBase64ToUint8Array } from '../utils/push-support'

export type PushStatus = 'unsupported' | 'needs-install' | 'blocked' | 'off' | 'on'

// Lo que se sabe sin consultar al service worker.
function initialStatus(): PushStatus {
  if (needsInstallForPush()) return 'needs-install'
  if (!isPushSupported()) return 'unsupported'
  if (Notification.permission === 'denied') return 'blocked'
  return 'off'
}

async function currentSubscription() {
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

// Estado y activación de las notificaciones push de este dispositivo.
export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>(initialStatus)

  // Sincronización con el navegador: ¿este dispositivo ya está suscrito?
  useEffect(() => {
    if (initialStatus() !== 'off') return
    void currentSubscription().then((subscription) => setStatus(subscription ? 'on' : 'off'))
  }, [])

  const enable = useMutation({
    mutationFn: async () => {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'blocked' : 'off')
        throw new Error('No se concedió el permiso para mostrar notificaciones.')
      }
      const publicKey = await fetchPushPublicKey()
      if (!publicKey) throw new Error('Las notificaciones aún no están configuradas en el servidor.')
      const registration = await navigator.serviceWorker.ready
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }))
      await savePushSubscription(subscription)
    },
    onSuccess: () => {
      setStatus('on')
      toast.success('Notificaciones activadas en este dispositivo.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'No se pudieron activar las notificaciones.')),
  })

  const disable = useMutation({
    mutationFn: async () => {
      const subscription = await currentSubscription()
      if (!subscription) return
      await deletePushSubscription(subscription.endpoint)
      await subscription.unsubscribe()
    },
    onSuccess: () => {
      setStatus('off')
      toast.success('Notificaciones desactivadas en este dispositivo.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'No se pudieron desactivar las notificaciones.')),
  })

  return { status, enable, disable, busy: enable.isPending || disable.isPending }
}
