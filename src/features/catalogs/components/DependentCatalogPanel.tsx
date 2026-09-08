import { useState } from 'react'
import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { SimpleCatalogTable } from './SimpleCatalogTable'
import { SimpleCatalogFormModal } from './SimpleCatalogFormModal'

interface CatalogItem {
  id: number
  name: string
  active: boolean
}

interface DependentCatalogPanelProps {
  /** Selectores de padre (país / estado) que filtran la lista. */
  parentSelectors: ReactNode
  /** Hay un padre seleccionado y por tanto se puede crear/listar. */
  canManage: boolean
  parentEmptyHint: string
  /** Plural para el contador ("estados"). */
  label: string
  /** Singular para el título del modal ("estado"). */
  singularLabel: string
  items: CatalogItem[]
  isCreating: boolean
  isUpdating: boolean
  onCreate: (name: string) => void
  onUpdate: (id: number, name: string) => void
  onToggleActive: (id: number) => void
}

// Panel de catálogo que depende de un elemento padre (Estado→País, Ciudad→Estado):
// muestra los selectores de padre, y la lista + alta solo cuando hay padre elegido.
export function DependentCatalogPanel({
  parentSelectors,
  canManage,
  parentEmptyHint,
  label,
  singularLabel,
  items,
  isCreating,
  isUpdating,
  onCreate,
  onUpdate,
  onToggleActive,
}: DependentCatalogPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)

  const isEditing = editingItem !== null

  function closeForm() {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 2 }}
      >
        {parentSelectors}
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          disabled={!canManage}
          onClick={() => setIsFormOpen(true)}
          sx={{ ml: 'auto' }}
        >
          Agregar
        </AppButton>
      </Stack>

      {!canManage ? (
        <EmptyState message={parentEmptyHint} />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {items.length} {label}
          </Typography>
          <SimpleCatalogTable
            items={items}
            onEdit={(item) => setEditingItem(item as CatalogItem)}
            onToggleActive={onToggleActive}
          />
        </>
      )}

      {(isFormOpen || isEditing) && (
        <SimpleCatalogFormModal
          title={isEditing ? `Editar ${singularLabel}` : `Agregar ${singularLabel}`}
          isSubmitting={isEditing ? isUpdating : isCreating}
          initialValues={editingItem ? { name: editingItem.name } : undefined}
          onSubmit={(values) => {
            if (isEditing && editingItem) {
              onUpdate(editingItem.id, values.name)
            } else {
              onCreate(values.name)
            }
            closeForm()
          }}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
