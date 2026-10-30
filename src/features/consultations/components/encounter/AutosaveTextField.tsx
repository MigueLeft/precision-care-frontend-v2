import { useEffect, useRef } from 'react'
import { TextField } from '@mui/material'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

interface AutosaveTextFieldProps {
  label?: string
  placeholder?: string
  value: string
  onSave: (value: string) => void
  disabled?: boolean
  minRows?: number
  // Clave del respaldo local en la consulta en curso (ver useConsultationDraftState).
  draftKey?: string
}

// TextField multiline con autoguardado por debounce. El valor del servidor solo
// pisa el local cuando el usuario no está escribiendo. Con `draftKey`, lo
// escrito se respalda en el navegador: si no llegó a guardarse (se salió de la
// página, venció la sesión), al volver se muestra y se vuelve a enviar.
export function AutosaveTextField({
  label,
  placeholder,
  value,
  onSave,
  disabled,
  minRows = 3,
  draftKey,
}: AutosaveTextFieldProps) {
  const [local, setLocal] = useConsultationDraftState(draftKey ?? null, value)
  const dirtyRef = useRef(local !== value)
  const debouncedSave = useDebouncedCallback((next: string) => {
    dirtyRef.current = false
    onSave(next)
  }, 1200)

  // Recupera lo pendiente del respaldo local: se reenvía una sola vez al montar.
  // Sigue "pendiente" hasta que el servidor devuelva ese mismo texto.
  useEffect(() => {
    if (dirtyRef.current && !disabled) onSave(local)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (value === local) dirtyRef.current = false
    else if (!dirtyRef.current) setLocal(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={local}
      disabled={disabled}
      multiline
      minRows={minRows}
      fullWidth
      onChange={(event) => {
        dirtyRef.current = true
        setLocal(event.target.value)
        debouncedSave(event.target.value)
      }}
      onBlur={() => {
        if (dirtyRef.current) {
          dirtyRef.current = false
          onSave(local)
        }
      }}
    />
  )
}
