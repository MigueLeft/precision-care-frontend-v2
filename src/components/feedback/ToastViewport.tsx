import { Slide, Snackbar, Stack, type SlideProps } from '@mui/material'
import { useToastStore } from '@/store/toast.store'
import { AppToast } from './AppToast'

const AUTO_HIDE_MS = 5000

// Entra y sale deslizándose desde el borde derecho.
function SlideFromRight(props: SlideProps) {
  return <Slide {...props} direction="left" />
}

// Pila de Snackbars en la esquina superior derecha. Cada Snackbar se renderiza
// en flujo (position: static) dentro del Stack fijo para poder apilarlos.
export function ToastViewport() {
  const items = useToastStore((state) => state.items)
  const close = useToastStore((state) => state.close)
  const remove = useToastStore((state) => state.remove)

  return (
    <Stack
      spacing={1.5}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.snackbar,
        pointerEvents: 'none',
      }}
    >
      {items.map((item) => (
        <Snackbar
          key={item.id}
          open={item.open}
          autoHideDuration={AUTO_HIDE_MS}
          onClose={(_event, reason) => {
            if (reason !== 'clickaway') close(item.id)
          }}
          slots={{ transition: SlideFromRight }}
          slotProps={{ transition: { onExited: () => remove(item.id) } }}
          sx={{ position: 'static', transform: 'none', pointerEvents: 'auto' }}
        >
          <AppToast
            severity={item.severity}
            title={item.title}
            message={item.message}
            onClose={() => close(item.id)}
          />
        </Snackbar>
      ))}
    </Stack>
  )
}
