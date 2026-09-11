import { useState } from 'react'
import {
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { SectionCard } from '@/components/ui/SectionCard'
import { useParaclinicalResultsByPatient } from '../hooks/useParaclinicalResultsByPatient'
import { useParaclinicalOrdersByPatient } from '../hooks/useParaclinicalOrdersByPatient'
import { useCreateParaclinicalResult } from '../hooks/useCreateParaclinicalResult'
import { useRemoveParaclinicalResult } from '../hooks/useRemoveParaclinicalResult'
import { ParaclinicalResultCard } from './ParaclinicalResultCard'
import { ParaclinicalOrderCard } from './ParaclinicalOrderCard'
import { AddParaclinicalResultForm } from './AddParaclinicalResultForm'

interface ParaclinicalPanelProps {
  patientId: number
}

type ParaclinicalView = 'lab' | 'imaging'

export function ParaclinicalPanel({ patientId }: ParaclinicalPanelProps) {
  const [view, setView] = useState<ParaclinicalView>('lab')
  const [addingResult, setAddingResult] = useState(false)
  const resultsQuery = useParaclinicalResultsByPatient(patientId)
  const ordersQuery = useParaclinicalOrdersByPatient(patientId)
  const { data: results = [] } = resultsQuery
  const { data: orders = [] } = ordersQuery
  const createMutation = useCreateParaclinicalResult(patientId)
  const removeMutation = useRemoveParaclinicalResult(patientId)

  const active = view === 'lab' ? resultsQuery : ordersQuery
  const isLoading = active.isLoading
  const isError = active.isError

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_event, next) => next && setView(next as ParaclinicalView)}
        >
          <ToggleButton value="lab">Laboratorios</ToggleButton>
          <ToggleButton value="imaging">Imagenología</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" spacing={1}>
          <AppButton
            variant="outlined"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setAddingResult((prev) => !prev)}
          >
            {addingResult ? 'Cancelar' : 'Ingresar resultados'}
          </AppButton>
          <AppButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 16 }} />} disabled>
            Ordenar examen
          </AppButton>
        </Stack>
      </Stack>

      {addingResult && (
        <SectionCard title="Nuevo resultado">
          <AddParaclinicalResultForm
            patientId={patientId}
            isAdding={createMutation.isPending}
            onAdd={(input) => createMutation.mutate(input)}
          />
        </SectionCard>
      )}

      {isLoading && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {isError && !isLoading && (
        <EmptyState message="No se pudo cargar la información de paraclínicos." />
      )}

      {view === 'lab' && !isLoading && !isError && (
        results.length === 0 ? (
          <EmptyState message="Sin resultados de laboratorio." />
        ) : (
          <Stack spacing={1.5}>
            {results.map((result) => (
              <ParaclinicalResultCard
                key={result.id}
                result={result}
                onRemove={() => removeMutation.mutate(result.id)}
              />
            ))}
          </Stack>
        )
      )}

      {view === 'imaging' && !isLoading && !isError && (
        orders.length === 0 ? (
          <EmptyState message="Sin órdenes de imagenología." />
        ) : (
          <Stack spacing={1.5}>
            {orders.map((order) => (
              <ParaclinicalOrderCard key={order.id} order={order} />
            ))}
          </Stack>
        )
      )}
    </Stack>
  )
}
