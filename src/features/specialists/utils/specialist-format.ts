import type { Specialist } from '../types'

export function formatSpecialistName(specialist: Specialist): string {
  return `${specialist.name} ${specialist.lastName}`.trim()
}

export function formatSpecialistInitials(specialist: Specialist): string {
  return `${specialist.name.charAt(0)}${specialist.lastName.charAt(0)}`.toUpperCase()
}

// "Ciudad, País" para la columna Ubicación y el encabezado del detalle.
export function formatSpecialistLocation(specialist: Specialist): string {
  return (
    [specialist.cityName, specialist.residenceCountryName]
      .filter(Boolean)
      .join(', ') || '—'
  )
}

// "Estado · Nacionalidad" como línea secundaria.
export function formatSpecialistLocationSub(specialist: Specialist): string {
  return [specialist.stateName, specialist.nationalityName]
    .filter(Boolean)
    .join(' · ')
}
