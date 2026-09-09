import { useState } from 'react'
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

interface ProblemsListProps {
  items: string[]
  readOnly: boolean
  placeholder: string
  emptyLabel: string
  onChange: (items: string[]) => void
}

// Lista editable de problemas: alta por Enter/＋, baja por ✕, pegado multilínea
// que se separa en varias entradas (portado de precision-system).
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
            <Stack
              key={`${index}-${item}`}
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                bgcolor: 'action.hover',
                borderRadius: 1,
                px: 1.5,
                py: 0.75,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '13px', flex: 1 }}>{item}</Typography>
              {!readOnly && (
                <IconButton
                  size="small"
                  aria-label="Quitar problema"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Stack>
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
