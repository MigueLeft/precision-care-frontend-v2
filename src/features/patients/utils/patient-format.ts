import type { Patient } from '../types'

// Orden explícito solicitado: apellido(s) primero, luego nombre(s).
export function formatPatientName(
  patient: Pick<Patient, 'firstName' | 'middleName' | 'lastName' | 'secondLastName'>,
): string {
  return [patient.lastName, patient.secondLastName, patient.firstName, patient.middleName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatPatientInitials(patient: Pick<Patient, 'firstName' | 'lastName'>): string {
  return `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase()
}

export function calculatePatientAge(birthDate: string): number {
  const today = new Date()
  const dob = new Date(`${birthDate}T00:00:00`)
  let age = today.getFullYear() - dob.getFullYear()
  const hadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
  if (!hadBirthdayThisYear) age -= 1
  return age
}

export function formatBirthDate(birthDate: string): string {
  return new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'short', day: '2-digit' }).format(
    new Date(`${birthDate}T00:00:00`),
  )
}
