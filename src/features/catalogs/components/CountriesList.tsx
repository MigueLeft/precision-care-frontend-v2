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
  onCreate: (values: { name: string; isoCode: string }) => void
}

export function CountriesList({ items, isCreating, onCreate }: CountriesListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

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

      <CountriesTable items={items} />

      <SimpleCatalogFormModal
        open={isFormOpen}
        title="Agregar país"
        showIsoCode
        isSubmitting={isCreating}
        onSubmit={(values) => {
          onCreate({ name: values.name, isoCode: values.isoCode ?? '' })
          setIsFormOpen(false)
        }}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  )
}
