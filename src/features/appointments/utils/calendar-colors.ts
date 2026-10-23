import { blue, cyan, deepOrange, deepPurple, green, indigo, pink, teal, amber, brown } from '@mui/material/colors'
import type { Appointment } from '../types'
import { getPrimarySpecialist } from './appointment-helpers'

// Un color por médico, como los calendarios de Google: siempre el mismo para
// el mismo especialista.
const SPECIALIST_PALETTE = [
  blue[600],
  green[600],
  deepPurple[400],
  deepOrange[600],
  teal[600],
  pink[500],
  indigo[500],
  amber[800],
  cyan[700],
  brown[400],
]

export function specialistColor(specialistId: number | null | undefined): string {
  if (specialistId == null) return SPECIALIST_PALETTE[0]
  return SPECIALIST_PALETTE[specialistId % SPECIALIST_PALETTE.length]
}

export function appointmentColor(appointment: Appointment): string {
  return specialistColor(getPrimarySpecialist(appointment)?.specialistId)
}

// Sin confirmar = "programada": se dibuja con borde (como un evento tentativo).
export function isUnconfirmed(appointment: Appointment): boolean {
  return appointment.status === 'scheduled'
}
