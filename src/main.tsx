import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '@/utils/theme'
import { queryClient } from '@/utils/query-client'
import App from '@/App'
import { initSentry, sentryRootOptions } from '@/utils/sentry'
import '@/index.css'

initSentry()

createRoot(document.getElementById('root')!, sentryRootOptions).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  </StrictMode>,
)
