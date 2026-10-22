import type { PatientFormValues } from '../schemas/patient-form.schema'
import type { CreatePatientDto } from '../schemas/patient.schema'

export function mapFormValuesToDto(values: PatientFormValues): CreatePatientDto {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    birthDate: values.birthDate,
    // Vacíos se envían como '' para que al editar se borre el valor anterior.
    middleName: values.middleName?.trim() ?? '',
    secondLastName: values.secondLastName?.trim() ?? '',
    identityDocument: values.identityDocument?.trim() ?? '',
    email: values.email || undefined,
    nationalityCountryId: values.nationalityCountryId,
    residenceCountryId: values.residenceCountryId,
  }
}
