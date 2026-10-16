import { LOGO_PATHS, LOGO_VIEWBOX } from '@/components/brand-logo-paths'
import { theme } from '@/utils/theme'
import type { DeliverableHeader } from '../types'

// Piezas comunes de las hojas impresas (carta horizontal partida en dos medias
// hojas de 5.5 × 8.5 pulgadas).

export const { palette } = theme

export const escape = (value: string | null | undefined) =>
  (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Varias líneas de texto (separadas por salto) como <br/>.
export const lines = (value: string | null | undefined) =>
  escape(value).split('\n').filter(Boolean).join('<br/>')

// "2026-10-16T…" → "16/10/2026" (día local).
export function formatDay(iso: string | null) {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export function logo(height: number) {
  return `<svg viewBox="${LOGO_VIEWBOX}" height="${height}" width="${(height * 229) / 261}">
  <path d="${LOGO_PATHS.center}" fill="${palette.brand.dark}"/>
  <path d="${LOGO_PATHS.bottom}" fill="${palette.brand.accent}"/>
  <path d="${LOGO_PATHS.top}" fill="${palette.brand.accent}"/>
</svg>`
}

// Cédula y edad del paciente (lo que haya).
export function patientIdLine(patient: DeliverableHeader['patient']) {
  return [
    patient.identityDocument ? `C.I.: ${escape(patient.identityDocument)}` : '',
    patient.age != null ? `Edad: ${patient.age} años` : '',
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ')
}

// Reparte la lista en hojas de `size` elementos (al menos una hoja).
export function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size))
  return pages.length > 0 ? pages : [[]]
}

export const baseStyles = `
  @page { size: letter landscape; margin: 0; }
  * { box-sizing: border-box; font-family: 'Montserrat', Arial, sans-serif; }
  body { margin: 0; color: ${palette.text.primary}; font-size: 11.5px; }
  .sheet { width: 11in; height: 8.5in; display: flex; page-break-after: always; break-after: page; }
  .sheet:last-child { page-break-after: auto; break-after: auto; }
  .half { width: 5.5in; height: 8.5in; padding: 0.35in 0.4in; display: flex; flex-direction: column; overflow: hidden; }
  .half + .half { border-left: 1px dashed ${palette.divider}; }
  .grow { flex: 1; }
  small, .muted { color: ${palette.text.secondary}; }
  p { margin: 0; }
`

// Abre el diálogo de impresión con el HTML en un iframe oculto.
export function printHtml(html: string) {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument
  if (!doc || !iframe.contentWindow) return
  doc.open()
  doc.write(html)
  doc.close()
  iframe.contentWindow.focus()
  iframe.contentWindow.print()
  setTimeout(() => iframe.remove(), 1000)
}
