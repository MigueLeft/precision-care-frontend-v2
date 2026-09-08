import { createFileRoute } from '@tanstack/react-router'
import { MedicalRecordSectionPlaceholder } from '@/features/medical-record'

export const Route = createFileRoute('/_app/pacientes_/$patientId/examen-fisico')({
  component: () => <MedicalRecordSectionPlaceholder section="Examen físico" />,
})
