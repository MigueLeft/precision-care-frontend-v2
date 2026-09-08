import type { ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface QueryBoundaryProps {
  isLoading: boolean
  isError: boolean
  error?: unknown
  children: ReactNode
}

// Estados de carga/error homogéneos para los paneles del expediente.
export function QueryBoundary({
  isLoading,
  isError,
  error,
  children,
}: QueryBoundaryProps) {
  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (isError) {
    return (
      <EmptyState
        message={getApiErrorMessage(error, 'No se pudo cargar la información.')}
      />
    )
  }

  return <>{children}</>
}
