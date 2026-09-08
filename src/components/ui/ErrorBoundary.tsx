import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Cambiar este valor reinicia el boundary (p. ej. la ruta activa). */
  resetKey?: string | number
  title?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

// ErrorBoundary por feature: aísla el fallo de una sección del expediente
// para que el resto de la app siga funcionando.
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <Box
          sx={{
            border: '1px dashed',
            borderColor: 'error.main',
            borderRadius: 1.5,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="error" sx={{ mb: 0.5 }}>
            {this.props.title ?? 'Algo salió mal en esta sección'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, fontSize: '13px' }}>
            {this.state.error.message}
          </Typography>
          <AppButton
            variant="outlined"
            size="small"
            onClick={() => this.setState({ error: null })}
          >
            Reintentar
          </AppButton>
        </Box>
      )
    }

    return this.props.children
  }
}
