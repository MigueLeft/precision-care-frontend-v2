import type {
  Antecedent,
  CreateAntecedentPayload,
  UpdateAntecedentPayload,
} from '../types'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { antecedentFormDefaultValues } from '../schemas/antecedent-form.schema'

function trimmed(value: string | undefined): string | undefined {
  const next = value?.trim()
  return next ? next : undefined
}

// Construye un objeto solo con los pares cuyo valor no es undefined.
function compact<T extends Record<string, string | undefined>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

// Convierte los valores planos del formulario al payload anidado del backend.
export function mapFormToPayload(
  values: AntecedentFormValues,
): Omit<CreateAntecedentPayload, 'patientId'> {
  const payload: Omit<CreateAntecedentPayload, 'patientId'> = {
    type: values.type,
    name: values.name.trim(),
    eventDate: trimmed(values.eventDate),
    description: trimmed(values.description),
    cie10Code: trimmed(values.cie10Code),
    relationship:
      values.type === 'family' ? trimmed(values.relationship) : undefined,
    status: values.type === 'personal' ? values.status : undefined,
  }

  if (values.type === 'surgery') {
    payload.surgeryDetail = compact({
      procedure: trimmed(values.surgeryProcedure),
      institution: trimmed(values.surgeryInstitution),
      complications: trimmed(values.surgeryComplications),
      treatingPhysician: trimmed(values.surgeryTreatingPhysician),
    })
  }

  if (values.type === 'hospitalization') {
    payload.hospitalizationDetail = compact({
      admissionDate: trimmed(values.hospitalizationAdmissionDate),
      dischargeDate: trimmed(values.hospitalizationDischargeDate),
      reason: trimmed(values.hospitalizationReason),
      institution: trimmed(values.hospitalizationInstitution),
      dischargeDiagnosisCie10: trimmed(
        values.hospitalizationDischargeDiagnosisCie10,
      ),
    })
  }

  return payload
}

export function mapFormToUpdatePayload(
  values: AntecedentFormValues,
): UpdateAntecedentPayload {
  return mapFormToPayload(values)
}

export function mapAntecedentToForm(antecedent: Antecedent): AntecedentFormValues {
  return {
    ...antecedentFormDefaultValues,
    type: antecedent.type,
    name: antecedent.name,
    eventDate: antecedent.eventDate ?? '',
    description: antecedent.description ?? '',
    cie10Code: antecedent.cie10Code ?? '',
    relationship: antecedent.relationship ?? '',
    status: antecedent.status ?? undefined,
    surgeryProcedure: antecedent.surgeryDetail?.procedure ?? '',
    surgeryInstitution: antecedent.surgeryDetail?.institution ?? '',
    surgeryComplications: antecedent.surgeryDetail?.complications ?? '',
    surgeryTreatingPhysician: antecedent.surgeryDetail?.treatingPhysician ?? '',
    hospitalizationAdmissionDate:
      antecedent.hospitalizationDetail?.admissionDate ?? '',
    hospitalizationDischargeDate:
      antecedent.hospitalizationDetail?.dischargeDate ?? '',
    hospitalizationReason: antecedent.hospitalizationDetail?.reason ?? '',
    hospitalizationInstitution:
      antecedent.hospitalizationDetail?.institution ?? '',
    hospitalizationDischargeDiagnosisCie10:
      antecedent.hospitalizationDetail?.dischargeDiagnosisCie10 ?? '',
  }
}
