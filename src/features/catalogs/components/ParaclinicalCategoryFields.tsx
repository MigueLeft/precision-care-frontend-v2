import { useState } from 'react'
import { Controller, useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { useParaclinicalCategories } from '../hooks/useParaclinicalCategories'
import { childCategories, rootCategories, rootOf } from '../utils/paraclinical-category-tree'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

type ParaclinicalCategoryFieldsProps = {
  control: Control<ParaclinicalFormValues>
}

// Categoría (solo raíces: Laboratorio, Imagen…) y luego su subcategoría. El
// estudio queda en la subcategoría o, si no se elige, en la categoría.
export function ParaclinicalCategoryFields({ control }: ParaclinicalCategoryFieldsProps) {
  const { data: categories = [] } = useParaclinicalCategories()
  const { field } = useController({ control, name: 'categoryId' })
  const [rootId, setRootId] = useState<number | ''>(() =>
    field.value ? rootOf(categories, field.value) : '',
  )
  // Si las categorías llegan después de montar, se deduce la raíz del valor.
  const currentRoot = rootId || (field.value ? rootOf(categories, field.value) : '')
  const subcategories = currentRoot ? childCategories(categories, currentRoot) : []

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="categoryId"
          control={control}
          render={({ fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="paraclinical-category-label">Categoría</InputLabel>
              <Select<number | ''>
                labelId="paraclinical-category-label"
                label="Categoría"
                value={currentRoot}
                onChange={(event) => {
                  const value = event.target.value === '' ? '' : Number(event.target.value)
                  setRootId(value)
                  field.onChange(value || 0)
                }}
              >
                {rootCategories(categories).map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth disabled={subcategories.length === 0}>
          <InputLabel id="paraclinical-subcategory-label">Subcategoría</InputLabel>
          <Select<number | ''>
            labelId="paraclinical-subcategory-label"
            label="Subcategoría"
            value={field.value && field.value !== currentRoot ? field.value : ''}
            onChange={(event) =>
              field.onChange(event.target.value === '' ? currentRoot || 0 : Number(event.target.value))
            }
          >
            <MenuItem value="">Sin subcategoría</MenuItem>
            {subcategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  )
}
