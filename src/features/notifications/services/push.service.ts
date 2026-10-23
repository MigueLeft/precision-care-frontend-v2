import { api } from '@/utils/api'

export async function fetchPushPublicKey(): Promise<string | null> {
  const { data } = await api.get<{ publicKey: string | null }>('/push/public-key')
  return data.publicKey
}

export async function savePushSubscription(subscription: PushSubscription): Promise<void> {
  await api.post('/push/subscriptions', subscription.toJSON())
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await api.delete('/push/subscriptions', { data: { endpoint } })
}
