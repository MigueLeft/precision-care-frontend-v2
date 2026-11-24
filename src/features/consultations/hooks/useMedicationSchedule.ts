import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import type { ConsultationMedication } from '../types'

type ScheduleField = 'dose' | 'frequency' | 'frequencyNotes' | 'duration'
type ScheduleValues = Record<ScheduleField, string>

// Mantiene el esquema del tratamiento en el borrador y conserva los campos no editados.
export function useMedicationSchedule(key: string, medication?: Pick<ConsultationMedication, ScheduleField>) {
  const [dose, setDose] = useConsultationDraftState(`${key}.dose`, medication?.dose ?? '')
  const [frequency, setFrequency] = useConsultationDraftState(`${key}.frequency`, medication?.frequency ?? '')
  const [frequencyNotes, setFrequencyNotes] = useConsultationDraftState(`${key}.frequencyNotes`, medication?.frequencyNotes ?? '')
  const [duration, setDuration] = useConsultationDraftState(`${key}.duration`, medication?.duration ?? '')
  const values: ScheduleValues = { dose, frequency, frequencyNotes, duration }
  const payload: ScheduleValues = { dose: dose.trim(), frequency: frequency.trim(), frequencyNotes: frequencyNotes.trim(), duration: duration.trim() }
  const changedPayload = {
    dose: payload.dose !== (medication?.dose ?? '') ? payload.dose : undefined,
    frequency: payload.frequency !== (medication?.frequency ?? '') ? payload.frequency : undefined,
    frequencyNotes: payload.frequencyNotes !== (medication?.frequencyNotes ?? '') ? payload.frequencyNotes : undefined,
    duration: payload.duration !== (medication?.duration ?? '') ? payload.duration : undefined,
  }

  function set(patch: Partial<ScheduleValues>) {
    if (patch.dose !== undefined) setDose(patch.dose)
    if (patch.frequency !== undefined) setFrequency(patch.frequency)
    if (patch.frequencyNotes !== undefined) setFrequencyNotes(patch.frequencyNotes)
    if (patch.duration !== undefined) setDuration(patch.duration)
  }

  function reset() {
    set({ dose: medication?.dose ?? '', frequency: medication?.frequency ?? '', frequencyNotes: medication?.frequencyNotes ?? '', duration: medication?.duration ?? '' })
  }

  return { values, payload, changedPayload, changed: Object.values(changedPayload).some((value) => value !== undefined), set, reset }
}

export type MedicationScheduleState = ReturnType<typeof useMedicationSchedule>
