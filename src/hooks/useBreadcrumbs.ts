import { useRouterState } from '@tanstack/react-router'

interface Breadcrumb {
  label: string
  to?: string
}

const PATHNAME_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/pacientes': 'Pacientes',
  '/citas': 'Citas',
  '/catalogos': 'Catálogos',
  '/usuarios-y-roles': 'Usuarios y roles',
  '/especialistas': 'Especialistas',
}

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const crumbs: Breadcrumb[] = [{ label: 'Inicio', to: '/' }]

  if (pathname.startsWith('/consultas/')) {
    crumbs.push({ label: 'Citas', to: '/citas' })
    crumbs.push({ label: 'Consulta en curso' })
    return crumbs
  }

  if (pathname.startsWith('/especialistas/')) {
    crumbs.push({ label: 'Especialistas', to: '/especialistas' })
    if (pathname === '/especialistas/nuevo') {
      crumbs.push({ label: 'Crear especialista' })
    } else if (pathname.endsWith('/editar')) {
      crumbs.push({ label: 'Editar especialista' })
    } else {
      crumbs.push({ label: 'Detalle del especialista' })
    }
    return crumbs
  }

  if (pathname !== '/') {
    const label = PATHNAME_LABELS[pathname] ?? pathname
    crumbs.push({ label })
  }

  return crumbs
}
