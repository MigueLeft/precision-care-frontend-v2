import { Stack } from '@mui/material'
import type { PhysicalExamChange } from '../../utils/physical-exam-changes'
import { ChangeLine } from './ChangeLine'

export function PhysicalExamChanges({ items }: { items: PhysicalExamChange[] }) {
  if (items.length === 0) return null
  return (
    <Stack spacing={0.75}>
      {items.map((item) => (
        <ChangeLine
          key={item.code}
          tag={item.before ? 'Examen físico' : 'Examen físico · nuevo'}
          tone={item.before ? 'info' : 'success'}
          title={item.label}
          detail={item.after}
        />
      ))}
    </Stack>
  )
}
