import { api } from '@/utils/api'
import type { ReferralProvider, ReferralProviderPayload } from '../types'

const BASE = '/catalogs/referral-providers'

export async function fetchReferralProviders(): Promise<ReferralProvider[]> {
  const { data } = await api.get<{ referralProviders: ReferralProvider[] }>(BASE)
  return data.referralProviders
}

export async function createReferralProvider(payload: ReferralProviderPayload): Promise<ReferralProvider> {
  const { data } = await api.post<{ referralProvider: ReferralProvider }>(BASE, payload)
  return data.referralProvider
}

export async function updateReferralProvider(
  id: number,
  payload: ReferralProviderPayload,
): Promise<ReferralProvider> {
  const { data } = await api.patch<{ referralProvider: ReferralProvider }>(`${BASE}/${id}`, payload)
  return data.referralProvider
}

export async function toggleReferralProviderActive(id: number): Promise<ReferralProvider> {
  const { data } = await api.patch<{ referralProvider: ReferralProvider }>(`${BASE}/${id}/toggle-active`)
  return data.referralProvider
}
