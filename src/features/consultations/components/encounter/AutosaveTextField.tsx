import { useEffect, useRef, useState } from 'react'
import { TextField } from '@mui/material'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'

interface AutosaveTextFieldProps {
  label?: string
  placeholder?: string
  value: string
  onSave: (value: string) => void
  disabled?: boolean
  minRows?: number
}

// TextField multiline con autoguardado por debounce. El valor del servidor solo
// pisa el local cuando el usuario no está escribiendo.
export function AutosaveTextField({
  label,
  placeholder,
  value,
  onSave,
  disabled,
  minRows = 3,
}: AutosaveTextFieldProps) {
  const [local, setLocal] = useState(value)
  const dirtyRef = useRef(false)
  const debouncedSave = useDebouncedCallback((next: string) => {
    dirtyRef.current = false
    onSave(next)
  }, 1200)

  useEffect(() => {
    if (!dirtyRef.current) setLocal(value)
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
