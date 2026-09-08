import { createFileRoute } from '@tanstack/react-router'
import { MedicationsPanel } from '@/features/patient-medications'

export const Route = createFileRoute('/_app/pacientes_/$patientId/medicamentos')({
  component: MedicamentosRoute,
})

function MedicamentosRoute() {
  const { patientId } = Route.useParams()
  return <MedicationsPanel patientId={Number(patientId)} />
}
