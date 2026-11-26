import { useState } from 'react'
import { Stack, Tab, Tabs, Typography } from '@mui/material'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { AccountingAppointments } from './AccountingAppointments'
import { AccountingAudit } from './AccountingAudit'

export function AccountingPage() {
  const [tab, setTab] = useState(0)
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}><Typography variant="h1">Contabilidad</Typography><Typography color="text.secondary">Cobros de citas, ingresos por especialista y cuentas por cobrar.</Typography></Stack>
      <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Vistas de contabilidad">
        <Tab label="Citas y pagos" id="accounting-payments-tab" aria-controls="accounting-panel" />
        <Tab label="Auditoría" id="accounting-audit-tab" aria-controls="accounting-panel" />
      </Tabs>
      <ErrorBoundary resetKey={tab} title="No se pudo mostrar contabilidad">
        <div role="tabpanel" id="accounting-panel" aria-labelledby={tab === 0 ? 'accounting-payments-tab' : 'accounting-audit-tab'}>
          {tab === 0 ? <AccountingAppointments /> : <AccountingAudit />}
        </div>
      </ErrorBoundary>
    </Stack>
  )
}
