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
import { useParaclinicalResultsByPatient } from '../hooks/useParaclinicalResultsByPatient'
import { useParaclinicalOrdersByPatient } from '../hooks/useParaclinicalOrdersByPatient'
import { ParaclinicalResultCard } from './ParaclinicalResultCard'
import { ParaclinicalOrderCard } from './ParaclinicalOrderCard'

interface ParaclinicalPanelProps {
  patientId: number
}

type ParaclinicalView = 'lab' | 'imaging'

export function ParaclinicalPanel({ patientId }: ParaclinicalPanelProps) {
  const [view, setView] = useState<ParaclinicalView>('lab')
  const resultsQuery = useParaclinicalResultsByPatient(patientId)
  const ordersQuery = useParaclinicalOrdersByPatient(patientId)
  const { data: results = [] } = resultsQuery
  const { data: orders = [] } = ordersQuery

  const active = view === 'lab' ? resultsQuery : ordersQuery
  const isLoading = active.isLoading
  const isError = active.isError

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_event, next) => next && setView(next as ParaclinicalView)}
        >
          <ToggleButton value="lab">Laboratorios</ToggleButton>
          <ToggleButton value="imaging">Imagenología</ToggleButton>
        </ToggleButtonGroup>
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          disabled
        >
          Ordenar paraclínico
        </AppButton>
      </Stack>

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
              <ParaclinicalResultCard key={result.id} result={result} />
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
