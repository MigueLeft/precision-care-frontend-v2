import { api } from '@/utils/api'
import type { Country, CivilStatus, Race, SocioeconomicLevel, Language, BodySystem } from '../types'

export async function fetchCountries(): Promise<Country[]> {
  const { data } = await api.get<{ countries: Country[] }>('/catalogs/countries')
  return data.countries
}

export async function createCountry(payload: { name: string; isoCode: string }): Promise<Country> {
  const { data } = await api.post<{ country: Country }>('/catalogs/countries', payload)
  return data.country
}

export async function updateCountry(id: number, payload: { name: string; isoCode: string }): Promise<Country> {
  const { data } = await api.patch<{ country: Country }>(`/catalogs/countries/${id}`, payload)
  return data.country
}

export async function fetchCivilStatuses(): Promise<CivilStatus[]> {
  const { data } = await api.get<{ civilStatuses: CivilStatus[] }>('/catalogs/civil-statuses')
  return data.civilStatuses
}

export async function createCivilStatus(name: string): Promise<CivilStatus> {
  const { data } = await api.post<{ civilStatus: CivilStatus }>('/catalogs/civil-statuses', { name })
  return data.civilStatus
}

export async function updateCivilStatus(id: number, name: string): Promise<CivilStatus> {
  const { data } = await api.patch<{ civilStatus: CivilStatus }>(`/catalogs/civil-statuses/${id}`, { name })
  return data.civilStatus
}

export async function toggleCivilStatusActive(id: number): Promise<CivilStatus> {
  const { data } = await api.patch<{ civilStatus: CivilStatus }>(
    `/catalogs/civil-statuses/${id}/toggle-active`,
  )
  return data.civilStatus
}

export async function fetchRaces(): Promise<Race[]> {
  const { data } = await api.get<{ races: Race[] }>('/catalogs/races')
  return data.races
}

export async function createRace(name: string): Promise<Race> {
  const { data } = await api.post<{ race: Race }>('/catalogs/races', { name })
  return data.race
}

export async function updateRace(id: number, name: string): Promise<Race> {
  const { data } = await api.patch<{ race: Race }>(`/catalogs/races/${id}`, { name })
  return data.race
}

export async function toggleRaceActive(id: number): Promise<Race> {
  const { data } = await api.patch<{ race: Race }>(`/catalogs/races/${id}/toggle-active`)
  return data.race
}

export async function fetchSocioeconomicLevels(): Promise<SocioeconomicLevel[]> {
  const { data } = await api.get<{ socioeconomicLevels: SocioeconomicLevel[] }>(
    '/catalogs/socioeconomic-levels',
  )
  return data.socioeconomicLevels
}

export async function createSocioeconomicLevel(name: string): Promise<SocioeconomicLevel> {
  const { data } = await api.post<{ socioeconomicLevel: SocioeconomicLevel }>(
    '/catalogs/socioeconomic-levels',
    { name },
  )
  return data.socioeconomicLevel
}

export async function updateSocioeconomicLevel(id: number, name: string): Promise<SocioeconomicLevel> {
  const { data } = await api.patch<{ socioeconomicLevel: SocioeconomicLevel }>(
    `/catalogs/socioeconomic-levels/${id}`,
    { name },
  )
  return data.socioeconomicLevel
}

export async function toggleSocioeconomicLevelActive(id: number): Promise<SocioeconomicLevel> {
  const { data } = await api.patch<{ socioeconomicLevel: SocioeconomicLevel }>(
    `/catalogs/socioeconomic-levels/${id}/toggle-active`,
  )
  return data.socioeconomicLevel
}

export async function fetchLanguages(): Promise<Language[]> {
  const { data } = await api.get<{ languages: Language[] }>('/catalogs/languages')
  return data.languages
}

export async function createLanguage(payload: { name: string; isoCode: string }): Promise<Language> {
  const { data } = await api.post<{ language: Language }>('/catalogs/languages', payload)
  return data.language
}

export async function updateLanguage(
  id: number,
  payload: { name: string; isoCode: string },
): Promise<Language> {
  const { data } = await api.patch<{ language: Language }>(`/catalogs/languages/${id}`, payload)
  return data.language
}

export async function toggleLanguageActive(id: number): Promise<Language> {
  const { data } = await api.patch<{ language: Language }>(`/catalogs/languages/${id}/toggle-active`)
  return data.language
}

export async function fetchBodySystems(): Promise<BodySystem[]> {
  const { data } = await api.get<{ bodySystems: BodySystem[] }>('/catalogs/body-systems')
  return data.bodySystems
}

export interface BodySystemPayload {
  name: string
  shortCode: string
  cie10Chapter?: string
  description?: string
}

export async function createBodySystem(payload: BodySystemPayload): Promise<BodySystem> {
  const { data } = await api.post<{ bodySystem: BodySystem }>('/catalogs/body-systems', payload)
  return data.bodySystem
}

export async function updateBodySystem(id: number, payload: BodySystemPayload): Promise<BodySystem> {
  const { data } = await api.patch<{ bodySystem: BodySystem }>(`/catalogs/body-systems/${id}`, payload)
  return data.bodySystem
}

export async function toggleBodySystemActive(id: number): Promise<BodySystem> {
  const { data } = await api.patch<{ bodySystem: BodySystem }>(`/catalogs/body-systems/${id}/toggle-active`)
  return data.bodySystem
}
