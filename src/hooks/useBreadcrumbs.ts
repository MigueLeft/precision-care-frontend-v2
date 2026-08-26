import { useRouterState } from '@tanstack/react-router'

interface Breadcrumb {
  label: string
  to?: string
}

const PATHNAME_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/pacientes': 'Pacientes',
  '/catalogos': 'Catálogos',
  '/usuarios-y-roles': 'Usuarios y roles',
}

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const crumbs: Breadcrumb[] = [{ label: 'Inicio', to: '/' }]

  if (pathname !== '/') {
    const label = PATHNAME_LABELS[pathname] ?? pathname
    crumbs.push({ label })
  }

  return crumbs
}
