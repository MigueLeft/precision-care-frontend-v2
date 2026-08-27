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
  isUpdating?: boolean
  onCreate: (values: { name: string; isoCode?: string }) => void
  onUpdate?: (id: number, values: { name: string; isoCode?: string }) => void
  onToggleActive: (id: number) => void
}

export function SimpleCatalogList({
  label,
  items,
  showIsoCode,
  isCreating,
  isUpdating,
  onCreate,
  onUpdate,
  onToggleActive,
}: SimpleCatalogListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SimpleCatalogItem | null>(null)

  const isEditing = editingItem !== null

  function closeForm() {
    setIsFormOpen(false)
    setEditingItem(null)
  }

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

      <SimpleCatalogTable
        items={items}
        showIsoCode={showIsoCode}
        onEdit={(item) => setEditingItem(item)}
        onToggleActive={onToggleActive}
      />

      {(isFormOpen || isEditing) && (
        <SimpleCatalogFormModal
          title={isEditing ? `Editar ${label.toLowerCase()}` : `Agregar ${label.toLowerCase()}`}
          showIsoCode={showIsoCode}
          isSubmitting={isEditing ? !!isUpdating : isCreating}
          initialValues={editingItem ?? undefined}
          onSubmit={(values) => {
            if (isEditing && editingItem) {
              onUpdate?.(editingItem.id, values)
            } else {
              onCreate(values)
            }
            closeForm()
          }}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
