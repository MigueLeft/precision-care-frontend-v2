import type { KeyboardEvent } from 'react'

// Clase que marca las celdas editables de la hoja de antropometría.
export const SHEET_INPUT_CLASS = 'anthropometry-sheet-input'

// Navegación tipo hoja de cálculo: Enter y ↓ pasan a la celda de abajo, ↑ a la
// de arriba (en el orden en que aparecen en la página).
export function handleSheetKeyDown(event: KeyboardEvent<HTMLInputElement>) {
  const step = event.key === 'Enter' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
  if (step === 0) return
  event.preventDefault()
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(`input.${SHEET_INPUT_CLASS}:not(:disabled)`))
  const next = inputs[inputs.indexOf(event.currentTarget) + step]
  if (next) {
    next.focus()
    next.select()
  }
}
