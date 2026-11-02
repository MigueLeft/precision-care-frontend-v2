import { useEffect, useRef, useState } from 'react'
import { TextField } from '@mui/material'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'

interface AutosaveFieldProps {
  label: string
  value: string
  onSave: (value: string) => void
  minRows?: number
}

// TextField multiline con autoguardado por debounce (como AutosaveTextField de
// consultas, pero sin respaldo local: esto vive en el expediente, no en una
// consulta en curso).
export function AutosaveField({ label, value, onSave, minRows = 3 }: AutosaveFieldProps) {
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
      value={local}
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
