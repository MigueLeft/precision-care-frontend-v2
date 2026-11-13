import { useEffect, useRef, type ComponentProps } from 'react'
import { styled } from '@mui/material/styles'

// Columna de la consulta: en pantallas anchas queda fija al hacer scroll y
// desplaza su propio contenido sin mover la página.
const ScrollColumn = styled('aside')(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  maxHeight: 'var(--workspace-column-height, calc(100dvh - 32px))',
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    position: 'sticky',
    top: theme.spacing(2),
  },
}))

// Acota el scroll al espacio realmente visible bajo la barra del paciente,
// incluso antes de que la columna alcance su posición sticky.
export function WorkspaceColumn({ children, ...props }: ComponentProps<typeof ScrollColumn>) {
  const columnRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const column = columnRef.current
    if (!column) return
    let frame = 0
    function measure() {
      if (!column) return
      const viewport = window.visualViewport
      const bottom = (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0)
      const top = Math.max(16, column.getBoundingClientRect().top)
      column.style.setProperty('--workspace-column-height', `${Math.max(160, bottom - top - 16)}px`)
    }
    function scheduleMeasure() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(column)
    if (column.parentElement) observer.observe(column.parentElement)
    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('scroll', scheduleMeasure, { passive: true })
    window.visualViewport?.addEventListener('resize', scheduleMeasure)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('scroll', scheduleMeasure)
      window.visualViewport?.removeEventListener('resize', scheduleMeasure)
    }
  }, [])

  return <ScrollColumn {...props} ref={columnRef}>{children}</ScrollColumn>
}
