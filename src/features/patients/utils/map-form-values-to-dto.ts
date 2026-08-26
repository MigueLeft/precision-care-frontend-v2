import type { PatientFormValues } from '../schemas/patient-form.schema'
import type { CreatePatientDto } from '../schemas/patient.schema'

export function mapFormValuesToDto(values: PatientFormValues): CreatePatientDto {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    birthDate: values.birthDate,
    middleName: values.middleName || undefined,
    secondLastName: values.secondLastName || undefined,
    email: values.email || undefined,
    nationalityCountryId: values.nationalityCountryId,
    residenceCountryId: values.residenceCountryId,
  }
}
