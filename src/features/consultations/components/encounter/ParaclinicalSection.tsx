import { useMemo, useState } from 'react'
import { IconButton, Tab, Tabs, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { useParaclinicalCategories, useParaclinicals } from '@/features/catalogs'
import {
  useParaclinicalResultsByPatient,
  useCreateParaclinicalResult,
  useRemoveParaclinicalResult,
  AddParaclinicalResultForm,
  PARACLINICAL_VALUE_STATUS_COLORS,
  formatReferenceRange,
} from '@/features/paraclinical'
import { formatShortDate } from '@/utils/format-date'

interface ParaclinicalSectionProps {
  index: number
  patientId: number
  readOnly: boolean
}

// Aplana los resultados del paciente en filas por analito, más recientes primero.
function useFlattenedResults(patientId: number) {
  const { data: results = [] } = useParaclinicalResultsByPatient(patientId)
  const { data: catalog = [] } = useParaclinicals()
  const categoryByStudy = new Map(catalog.map((item) => [item.id, item.categoryId]))

  return results
    .flatMap((result) =>
      result.values.map((value, index) => ({
        rowId: `${result.id}-${index}`,
        resultId: result.id,
        categoryId: categoryByStudy.get(value.paraclinicalCatalogId) ?? null,
        date: result.resultDate,
        value,
      })),
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function ParaclinicalSection({ index, patientId, readOnly }: ParaclinicalSectionProps) {
  const [categoryId, setCategoryId] = useState<number | 'all'>('all')
  const { data: categories = [] } = useParaclinicalCategories()
  const rows = useFlattenedResults(patientId)
  const createMutation = useCreateParaclinicalResult(patientId)
  const removeMutation = useRemoveParaclinicalResult(patientId)

  const filtered = useMemo(
    () => (categoryId === 'all' ? rows : rows.filter((row) => row.categoryId === categoryId)),
    [rows, categoryId],
  )

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
      <Tabs
        value={categoryId}
        onChange={(_e, value) => setCategoryId(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 1.5, minHeight: 32, '& .MuiTab-root': { minHeight: 32, fontSize: '13px' } }}
      >
        <Tab label={`Todos ${rows.length}`} value="all" />
        {categories.map((category) => (
          <Tab
            key={category.id}
            label={`${category.name} ${rows.filter((r) => r.categoryId === category.id).length}`}
            value={category.id}
          />
        ))}
      </Tabs>

      {filtered.length > 0 && (
        <DataTable minWidth={640}>
          <TableHead>
            <TableRow>
              {['Estudio', 'Resultado', 'Unidad', 'Referencia', 'Fecha', ''].map((h) => (
                <HeadCell key={h}>{h}</HeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => {
              const abnormal = row.value.status && row.value.status !== 'normal'
              return (
                <TableRow key={row.rowId}>
                  <DataCell>{row.value.paraclinicalName ?? '—'}</DataCell>
                  <DataCell
                    sx={{ fontWeight: 700, color: abnormal ? `${PARACLINICAL_VALUE_STATUS_COLORS[row.value.status!]}.main` : undefined }}
                  >
                    {row.value.numericValue ?? row.value.textValue ?? '—'}
                  </DataCell>
                  <DataCell sx={{ color: 'text.secondary' }}>{row.value.unit ?? '—'}</DataCell>
                  <DataCell sx={{ color: 'text.secondary' }}>{formatReferenceRange(row.value)}</DataCell>
                  <DataCell sx={{ color: 'text.secondary' }}>{formatShortDate(row.date)}</DataCell>
                  <DataCell align="right">
                    {!readOnly && (
                      <IconButton
                        size="small"
                        aria-label="Quitar resultado"
                        onClick={() => removeMutation.mutate(row.resultId)}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </DataCell>
                </TableRow>
              )
            })}
          </TableBody>
        </DataTable>
      )}

      {!readOnly && (
        <AddParaclinicalResultForm
          patientId={patientId}
          isAdding={createMutation.isPending}
          onAdd={(input) => createMutation.mutate(input)}
        />
      )}
    </CollapsibleSection>
  )
}
