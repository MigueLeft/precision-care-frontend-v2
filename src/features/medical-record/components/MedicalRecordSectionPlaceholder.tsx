import { EmptyState } from '@/components/EmptyState'

interface MedicalRecordSectionPlaceholderProps {
  section: string
}

// Placeholder temporal para las secciones del expediente aún no implementadas.
export function MedicalRecordSectionPlaceholder({
  section,
}: MedicalRecordSectionPlaceholderProps) {
  return <EmptyState message={`${section} — próximamente.`} />
}
