import { createFileRoute } from '@tanstack/react-router'
import { PublicIntakeFillPage } from '@/features/intake-fill'

// Ruta pública (sin sesión, sin AppShell): el paciente llena el ingresable
// desde el link que se le envía por correo. Vive fuera de _app/_auth a
// propósito — no requiere isAuthenticated.
export const Route = createFileRoute('/ingresable-publico/$token')({
  component: IngresablePublicoRoute,
})

function IngresablePublicoRoute() {
  const { token } = Route.useParams()
  return <PublicIntakeFillPage token={token} />
}
