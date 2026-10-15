import { useTheme } from '@mui/material'
import { LOGO_PATHS, LOGO_VIEWBOX } from './brand-logo-paths'

type BrandLogoProps = {
  // Alto en px; el ancho se ajusta a la proporción del isotipo.
  height?: number
  // "light" para fondos oscuros (sidebar, login): la gota central va en blanco.
  variant?: 'light' | 'dark'
}

export function BrandLogo({ height = 32, variant = 'light' }: BrandLogoProps) {
  const theme = useTheme()
  const accent = theme.palette.brand.accent
  const center = variant === 'light' ? theme.palette.common.white : theme.palette.brand.dark

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      height={height}
      width={(height * 229) / 261}
      role="img"
      aria-label="PrecisionCare"
      style={{ flexShrink: 0 }}
    >
      <path d={LOGO_PATHS.center} fill={center} />
      <path d={LOGO_PATHS.bottom} fill={accent} />
      <path d={LOGO_PATHS.top} fill={accent} />
    </svg>
  )
}
