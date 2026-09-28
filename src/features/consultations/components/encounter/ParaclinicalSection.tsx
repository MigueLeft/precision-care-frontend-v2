import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { CollapsibleGroup } from '@/components/ui/CollapsibleGroup'
import { useParaclinicalCategories, useParaclinicals } from '@/features/catalogs'
import type { ParaclinicalCategoryCatalog } from '@/features/catalogs'
import {
  useParaclinicalResultsByPatient,
  useCreateParaclinicalResult,
  useRemoveParaclinicalValue,
  AddParaclinicalResultForm,
  type CreateParaclinicalResultInput,
} from '@/features/paraclinical'
import { ParaclinicalResultsTable, type ParaclinicalRow } from './ParaclinicalResultsTable'

interface ParaclinicalSectionProps {
  index: number
  patientId: number
  readOnly: boolean
}

// Sube por parentId hasta la categoría raíz (Laboratorio, Imagen…), para que
// los estudios de una subcategoría (p. ej. Química sanguínea) caigan en su raíz.
function findRootCategoryId(
  categoryId: number | undefined,
  byId: Map<number, ParaclinicalCategoryCatalog>,
): number | null {
  let current = categoryId !== undefined ? byId.get(categoryId) : undefined
  while (current?.parentId != null && byId.has(current.parentId)) {
    current = byId.get(current.parentId)
  }
  return current?.id ?? null
}

// Aplana los resultados del paciente en filas por analito, más recientes primero
// (a igual fecha, el último capturado arriba). `rootOf` da la categoría raíz de
// un estudio del catálogo.
function useParaclinicalRows(patientId: number, categories: ParaclinicalCategoryCatalog[]) {
  const { data: results = [] } = useParaclinicalResultsByPatient(patientId)
  const { data: catalog = [] } = useParaclinicals()
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const categoryByStudy = new Map(catalog.map((item) => [item.id, item.categoryId]))
  const rootOf = (studyId: number) => findRootCategoryId(categoryByStudy.get(studyId), categoryById)

  const rows = results
    .flatMap((result): ParaclinicalRow[] =>
      result.values.map((value) => ({
        rowId: `${result.id}-${value.id}`,
        resultId: result.id,
        rootCategoryId: rootOf(value.paraclinicalCatalogId),
        date: result.resultDate,
        value,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.value.id - a.value.id)
  return { rows, rootOf }
}

// Un desplegable por categoría raíz de paraclínicos (sin vista "Todos").
export function ParaclinicalSection({ index, patientId, readOnly }: ParaclinicalSectionProps) {
  const { data: categories = [] } = useParaclinicalCategories()
  const { rows, rootOf } = useParaclinicalRows(patientId, categories)
  const createMutation = useCreateParaclinicalResult(patientId)
  const removeMutation = useRemoveParaclinicalValue(patientId)
  // Grupo que se despliega tras agregar un estudio (para ver lo recién capturado).
  const [opened, setOpened] = useState({ key: '', signal: 0 })

  function add(input: CreateParaclinicalResultInput) {
    const studyId = input.values[0]?.paraclinicalCatalogId
    const key = String(studyId !== undefined ? (rootOf(studyId) ?? 'none') : 'none')
    createMutation.mutate(input, {
      onSuccess: () => setOpened((prev) => ({ key, signal: prev.signal + 1 })),
    })
  }

  const rootCategories = categories.filter((category) => category.active && category.parentId == null)
  const uncategorized = rows.filter((row) => row.rootCategoryId == null)
  const groups = [
    ...rootCategories.map((category) => ({
      key: String(category.id),
      title: category.name,
      rows: rows.filter((row) => row.rootCategoryId === category.id),
    })),
    ...(uncategorized.length > 0
      ? [{ key: 'none', title: 'Sin categoría', rows: uncategorized }]
      : []),
  ]

  return (
    <CollapsibleSection
      title={`${index}. Paraclínicos`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {rows.length} registrados
        </Typography>
      }
      defaultExpanded
    >
      <Stack spacing={1}>
        {groups.map((group) => (
          <CollapsibleGroup
            key={group.key}
            title={group.title}
            headerMeta={
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {group.rows.length}
              </Typography>
            }
            defaultExpanded={group.rows.length > 0}
            openSignal={opened.key === group.key ? opened.signal : 0}
          >
            {group.rows.length > 0 ? (
              <ParaclinicalResultsTable
                rows={group.rows}
                readOnly={readOnly}
                onRemove={(resultId, valueId) => removeMutation.mutate({ resultId, valueId })}
              />
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                Sin resultados registrados.
              </Typography>
            )}
          </CollapsibleGroup>
        ))}
      </Stack>
      {!readOnly && (
        <AddParaclinicalResultForm
          patientId={patientId}
          isAdding={createMutation.isPending}
          onAdd={add}
        />
      )}
    </CollapsibleSection>
  )
}
