import type { Specialist } from '../types'
import type { SpecialistStatusFilter } from '../components/SpecialistsToolbar'

interface Filters {
  q: string
  specialtyId: number | undefined
  status: SpecialistStatusFilter
}

export function filterSpecialists(
  specialists: Specialist[],
  { q, specialtyId, status }: Filters,
): Specialist[] {
  const term = q.trim().toLowerCase()

  return specialists.filter((s) => {
    if (status === 'active' && !s.active) return false
    if (status === 'inactive' && s.active) return false

    if (specialtyId) {
      const matchesSpecialty =
        s.primarySpecialtyId === specialtyId ||
        s.otherSpecialties.some((o) => o.id === specialtyId)
      if (!matchesSpecialty) return false
    }

    if (term) {
      const haystack = [
        s.name,
        s.lastName,
        s.email,
        s.primarySpecialtyName ?? '',
        ...s.otherSpecialties.map((o) => o.name),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(term)) return false
    }

    return true
  })
}
