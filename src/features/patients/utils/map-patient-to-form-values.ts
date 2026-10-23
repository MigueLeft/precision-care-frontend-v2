import type { Patient } from '../types'
import type { PatientFormValues } from '../schemas/patient-form.schema'

export function mapPatientToFormValues(patient: Patient): PatientFormValues {
  return {
    firstName: patient.firstName,
    middleName: patient.middleName ?? '',
    lastName: patient.lastName,
    secondLastName: patient.secondLastName ?? '',
    identityDocument: patient.identityDocument ?? '',
    birthDate: patient.birthDate,
    email: patient.email ?? '',
    phone: patient.phone ?? '',
    nationalityCountryId: patient.nationalityCountryId ?? undefined,
    residenceCountryId: patient.residenceCountryId ?? undefined,
  }
}
