import { useState } from 'react'
import { IconButton, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ProblemItem } from './ProblemItem'

interface ProblemsListProps {
  items: string[]
  readOnly: boolean
  placeholder: string
  emptyLabel: string
  onChange: (items: string[]) => void
}

// Lista editable de notas: alta por Enter/＋, edición en línea, baja por ✕ y
// pegado multilínea que se separa en varias entradas (portado de precision-system).
export function ProblemsList({
  items,
  readOnly,
  placeholder,
  emptyLabel,
  onChange,
}: ProblemsListProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const value = draft.trim()
    if (!value) return
    onChange([...items, value])
    setDraft('')
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text')
    if (!/\r\n|\r|\n/.test(text)) return
    event.preventDefault()
    const lines = text
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    if (lines.length > 0) onChange([...items, ...lines])
  }

  return (
    <Stack spacing={1}>
      {items.length === 0 ? (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
          {emptyLabel}
        </Typography>
      ) : (
        <Stack spacing={0.5}>
          {items.map((item, index) => (
            <ProblemItem
              key={`${index}-${item}`}
              value={item}
              readOnly={readOnly}
              onChange={(next) => onChange(items.map((current, i) => (i === index ? next : current)))}
              onRemove={() => onChange(items.filter((_, i) => i !== index))}
            />
          ))}
        </Stack>
      )}

      {!readOnly && (
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder={placeholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                add()
              }
            }}
            onPaste={handlePaste}
          />
          <IconButton size="small" aria-label="Agregar problema" onClick={add}>
            <AddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      )}
    </Stack>
  )
}
