import type { LabProfile } from '@/features/catalogs'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

// Perfiles cuyos estudios están todos en la orden (selección inicial al abrir).
function coveredProfiles(profiles: LabProfile[], ids: number[]): number[] {
  return profiles
    .filter((p) => p.items.length > 0 && p.items.every((item) => ids.includes(item.id)))
    .map((p) => p.id)
}

// Estudios de la orden, perfiles seleccionados y título. Mientras no se escriba
// un título a mano, el título son los nombres de los perfiles seleccionados en
// ese momento; si se borra, vuelve a ese automático.
export function useLabOrderSelection(
  profiles: LabProfile[],
  initialIds: number[],
  initialTitle: string,
) {
  const autoTitle = (selection: number[]) =>
    selection
      .map((id) => profiles.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(' + ')

  const [ids, setIds] = useConsultationDraftState('labOrder.ids', initialIds)
  const [selected, setSelected] = useConsultationDraftState('labOrder.selected', () => coveredProfiles(profiles, initialIds))
  const [manualTitle, setManualTitle] = useConsultationDraftState<string | null>('labOrder.manualTitle', () =>
    initialTitle && initialTitle !== autoTitle(coveredProfiles(profiles, initialIds))
      ? initialTitle
      : null,
  )

  function toggleProfile(profile: LabProfile) {
    const profileIds = profile.items.map((item) => item.id)
    if (selected.includes(profile.id)) {
      const rest = selected.filter((id) => id !== profile.id)
      // Se quitan sus estudios, salvo los que también trae otro perfil seleccionado.
      const kept = new Set(
        profiles.filter((p) => rest.includes(p.id)).flatMap((p) => p.items.map((i) => i.id)),
      )
      setSelected(rest)
      setIds((prev) => prev.filter((id) => !profileIds.includes(id) || kept.has(id)))
    } else {
      setSelected((prev) => [...prev, profile.id])
      setIds((prev) => [...prev, ...profileIds.filter((id) => !prev.includes(id))])
    }
  }

  return {
    ids,
    setIds,
    selected,
    toggleProfile,
    title: manualTitle ?? autoTitle(selected),
    typeTitle: (value: string) => setManualTitle(value.trim() === '' ? null : value),
  }
}
