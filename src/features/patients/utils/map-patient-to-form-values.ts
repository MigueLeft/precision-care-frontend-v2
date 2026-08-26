import type { Patient } from '../types'
import type { PatientFormValues } from '../schemas/patient-form.schema'

export function mapPatientToFormValues(patient: Patient): PatientFormValues {
  return {
    firstName: patient.firstName,
    middleName: patient.middleName ?? '',
    lastName: patient.lastName,
    secondLastName: patient.secondLastName ?? '',
    birthDate: patient.birthDate,
    email: patient.email ?? '',
    nationalityCountryId: patient.nationalityCountryId ?? undefined,
    residenceCountryId: patient.residenceCountryId ?? undefined,
  }
}
