import { useQuery } from '@tanstack/react-query'
import { fetchReferralProviders } from '../services/referral-providers.service'
import { catalogsKeys } from './catalogs.keys'

export function useReferralProviders() {
  return useQuery({
    queryKey: catalogsKeys.referralProviders,
    queryFn: fetchReferralProviders,
  })
}
