import { useState } from 'react'
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Campo de contraseña con botón para mostrarla u ocultarla.
export function PasswordField(props: Omit<TextFieldProps, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisible((value) => !value)}
                edge="end"
                size="small"
                tabIndex={-1}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {visible ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
