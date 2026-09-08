import { createFileRoute, redirect } from '@tanstack/react-router'

// La raíz del expediente redirige al apartado "Resumen".
export const Route = createFileRoute('/_app/pacientes_/$patientId/')({
  beforeLoad: ({ params: { patientId } }) => {
    throw redirect({
      to: '/pacientes/$patientId/resumen',
      params: { patientId },
    })
  },
})
