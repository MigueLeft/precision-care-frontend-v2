import { useState } from 'react'
import type { StudyOrder, StudyOrderContentPayload } from '../../types'
import type { ProviderChoice } from './ProviderPicker'
import type { StudyItemValue } from './StudyItemsPicker'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

type FormState = {
  provider: ProviderChoice
  items: StudyItemValue[]
  indications: string
  specialistId: number | null
}

function fromOrder(order: StudyOrder | null, defaultSpecialistId: number | null): FormState {
  return {
    provider: order?.referralProvider
      ? { kind: 'catalog', id: order.referralProvider.id, name: order.referralProvider.name }
      : null,
    items: order?.items.map(({ paraclinicalCatalogId, name }) => ({ paraclinicalCatalogId, name })) ?? [],
    indications: order?.indications ?? '',
    specialistId: order?.specialistId ?? defaultSpecialistId,
  }
}

// Estado del formulario de una orden de estudio: valores, cambios sin guardar
// y el cuerpo que espera el backend (UpdateStudyOrderSchema).
export function useStudyOrderForm(order: StudyOrder | null, defaultSpecialistId: number | null) {
  const [form, setForm] = useConsultationDraftState<FormState>(`studyOrder:${order?.id ?? "new"}.form`, () => fromOrder(order, defaultSpecialistId))
  const [saved, setSaved] = useState<FormState>(form)
  const dirty = JSON.stringify(form) !== JSON.stringify(saved)

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  function payload(): StudyOrderContentPayload {
    const { provider } = form
    return {
      referralProviderId: provider?.kind === 'catalog' ? provider.id : null,
      newReferralProvider: provider?.kind === 'new' ? provider.values : undefined,
      indications: form.indications.trim() || undefined,
      specialistId: form.specialistId ?? undefined,
      items: form.items.map((item) =>
        item.paraclinicalCatalogId !== null ? { paraclinicalCatalogId: item.paraclinicalCatalogId } : { name: item.name },
      ),
    }
  }

  // Tras guardar, el formulario toma lo que devolvió el backend (el centro nuevo ya tiene id).
  function markSaved(next: StudyOrder) {
    const state = fromOrder(next, form.specialistId)
    setForm(state)
    setSaved(state)
  }

  return { form, set, dirty, payload, markSaved }
}
