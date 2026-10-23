import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js'

// Valida un teléfono en E.164 (lo que entrega PhoneField).
export function isValidPhone(value: string): boolean {
  return isValidPhoneNumber(value)
}

// "+58 412 1234567" para mostrar en listas y detalles.
export function formatPhone(value: string | null | undefined): string | null {
  if (!value) return null
  return parsePhoneNumberFromString(value)?.formatInternational() ?? value
}
