import { createFileRoute } from '@tanstack/react-router'
import { usePatient } from '@/features/patients'
import { SummaryPanel } from '@/features/medical-record'

export const Route = createFileRoute('/_app/pacientes_/$patientId/resumen')({
  component: ResumenRoute,
})

function ResumenRoute() {
  const { patientId } = Route.useParams()
  const { data: patient } = usePatient(Number(patientId))

  if (!patient) return null

  return <SummaryPanel patient={patient} />
}
