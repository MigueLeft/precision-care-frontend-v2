import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { CountriesTable } from './CountriesTable'
import { SimpleCatalogFormModal } from './SimpleCatalogFormModal'
import type { Country } from '../types'

interface CountriesListProps {
  items: Country[]
  isCreating: boolean
  isUpdating?: boolean
  onCreate: (values: { name: string; isoCode: string }) => void
  onUpdate?: (id: number, values: { name: string; isoCode: string }) => void
}

export function CountriesList({ items, isCreating, isUpdating, onCreate, onUpdate }: CountriesListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Country | null>(null)

  const isEditing = editingItem !== null

  function closeForm() {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {items.length} países
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

      <CountriesTable items={items} onEdit={(item) => setEditingItem(item)} />

      {(isFormOpen || isEditing) && (
        <SimpleCatalogFormModal
          title={isEditing ? 'Editar país' : 'Agregar país'}
          showIsoCode
          isSubmitting={isEditing ? !!isUpdating : isCreating}
          initialValues={editingItem ?? undefined}
          onSubmit={(values) => {
            const isoCode = values.isoCode ?? ''
            if (isEditing && editingItem) {
              onUpdate?.(editingItem.id, { name: values.name, isoCode })
            } else {
              onCreate({ name: values.name, isoCode })
            }
            closeForm()
          }}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
