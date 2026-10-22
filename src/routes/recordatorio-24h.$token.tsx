import { createFileRoute } from '@tanstack/react-router'
import { NutriBotChatPage } from '@/features/nutrition-recall'

// Ruta pública (sin sesión, sin AppShell): el paciente hace el Recordatorio de
// 24 Horas con NutriBot desde el link que se le envía por correo.
export const Route = createFileRoute('/recordatorio-24h/$token')({
  component: RecordatorioRoute,
})

function RecordatorioRoute() {
  const { token } = Route.useParams()
  return <NutriBotChatPage token={token} />
}
