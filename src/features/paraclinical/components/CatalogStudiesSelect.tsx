import { useState } from 'react'
import { Stack } from '@mui/material'
import { SearchableMultiSelect } from '@/components/SearchableMultiSelect'
import { categoryWithDescendants, useParaclinicalCategories, useParaclinicals } from '@/features/catalogs'
import { RootCategorySelect } from './RootCategorySelect'

type CatalogStudiesSelectProps = {
  value: number[]
  onChange: (ids: number[]) => void
}

// Varios estudios sueltos del catálogo para capturarlos juntos. La categoría
// solo filtra la lista: lo ya elegido se conserva al cambiarla.
export function CatalogStudiesSelect({ value, onChange }: CatalogStudiesSelectProps) {
  const { data: categories = [] } = useParaclinicalCategories()
  const { data: catalog = [] } = useParaclinicals()
  const [categoryId, setCategoryId] = useState<number | ''>('')

  const inCategory = categoryId === '' ? null : categoryWithDescendants(categories, categoryId)
  const options = catalog
    .filter(
      (item) =>
        value.includes(item.id) || (item.active && (!inCategory || inCategory.has(item.categoryId))),
    )
    .map((item) => ({ id: item.id, label: item.name }))

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <RootCategorySelect categories={categories} value={categoryId} onChange={setCategoryId} />
      <Stack sx={{ flex: 1, width: '100%' }}>
        <SearchableMultiSelect
          label="Estudios del catálogo"
          placeholder="Elige uno o más estudios…"
          options={options}
          value={value}
          onChange={onChange}
          maxVisibleOptions={8}
        />
      </Stack>
    </Stack>
  )
}
