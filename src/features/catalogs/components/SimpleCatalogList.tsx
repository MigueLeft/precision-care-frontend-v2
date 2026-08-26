import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { SimpleCatalogTable } from './SimpleCatalogTable'
import { SimpleCatalogFormModal } from './SimpleCatalogFormModal'

interface SimpleCatalogItem {
  id: number
  name: string
  active: boolean
  isoCode?: string
}

interface SimpleCatalogListProps {
  label: string
  items: SimpleCatalogItem[]
  showIsoCode?: boolean
  isCreating: boolean
  onCreate: (values: { name: string; isoCode?: string }) => void
  onToggleActive: (id: number) => void
}

export function SimpleCatalogList({
  label,
  items,
  showIsoCode,
  isCreating,
  onCreate,
  onToggleActive,
}: SimpleCatalogListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {items.length} {label.toLowerCase()}
        </Typography>
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsFormOpen(true)}
        >
          Agregar
        </AppButton>
      </Stack>

      <SimpleCatalogTable items={items} showIsoCode={showIsoCode} onToggleActive={onToggleActive} />

      <SimpleCatalogFormModal
        open={isFormOpen}
        title={`Agregar ${label.toLowerCase()}`}
        showIsoCode={showIsoCode}
        isSubmitting={isCreating}
        onSubmit={(values) => {
          onCreate(values)
          setIsFormOpen(false)
        }}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  )
}
