import type {
  CreateSpecialistPayload,
  Specialist,
  UpdateSpecialistPayload,
} from '../types'
import {
  specialistFormDefaultValues,
  type SpecialistFormValues,
} from '../schemas/specialist-form.schema'

export function mapFormToCreatePayload(
  values: SpecialistFormValues,
): CreateSpecialistPayload {
  return {
    name: values.name,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone || undefined,
    nationalityCountryId: values.nationalityCountryId,
    residenceCountryId: values.residenceCountryId,
    stateId: values.stateId || undefined,
    cityId: values.cityId || undefined,
    primarySpecialtyId: values.primarySpecialtyId,
    otherSpecialtyIds: values.otherSpecialtyIds,
    practiceAddress: values.practiceAddress || undefined,
    user: values.createUser
      ? {
          roleId: values.roleId as number,
          initialStatus: values.initialStatus,
          passwordMode: values.passwordMode,
        }
      : undefined,
  }
}

export function mapFormToUpdatePayload(
  values: SpecialistFormValues,
): UpdateSpecialistPayload {
  return {
    name: values.name,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone || undefined,
    nationalityCountryId: values.nationalityCountryId,
    residenceCountryId: values.residenceCountryId,
    stateId: values.stateId || undefined,
    cityId: values.cityId || undefined,
    primarySpecialtyId: values.primarySpecialtyId,
    otherSpecialtyIds: values.otherSpecialtyIds,
    practiceAddress: values.practiceAddress || undefined,
  }
}

export function mapSpecialistToFormValues(
  specialist: Specialist,
): SpecialistFormValues {
  return {
    ...specialistFormDefaultValues,
    name: specialist.name,
    lastName: specialist.lastName,
    email: specialist.email,
    phone: specialist.phone ?? '',
    nationalityCountryId: specialist.nationalityCountryId ?? 0,
    residenceCountryId: specialist.residenceCountryId ?? 0,
    stateId: specialist.stateId ?? undefined,
    cityId: specialist.cityId ?? undefined,
    primarySpecialtyId: specialist.primarySpecialtyId ?? 0,
    otherSpecialtyIds: specialist.otherSpecialties.map((s) => s.id),
    practiceAddress: specialist.practiceAddress ?? '',
    createUser: false,
  }
}
