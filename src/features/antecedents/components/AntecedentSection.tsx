import type { ReactNode } from 'react'
import { Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { AppButton } from '@/components/AppButton'

type Props = { title: string; onAdd: () => void; children: ReactNode }

export function AntecedentSection({ title, onAdd, children }: Props) {
  return (
    <CollapsibleSection title={title} defaultExpanded>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <AppButton size="small" variant="outlined" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={onAdd}>
            Agregar
          </AppButton>
        </Stack>
        {children}
      </Stack>
    </CollapsibleSection>
  )
}
