import { Button, CircularProgress } from '@mui/material'
import type { ButtonProps } from '@mui/material'

type AppButtonProps = ButtonProps & {
  loading?: boolean
}

export function AppButton({ loading = false, disabled, children, startIcon, ...rest }: AppButtonProps) {
  return (
    <Button
      {...rest}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
    >
      {children}
    </Button>
  )
}
