import { useState } from 'react'
import { Box, Fab, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useAgendaAppointments } from '../../hooks/useAgendaAppointments'
import { useCancelAppointment, useCreateAppointment } from '../../hooks/useAppointmentMutations'
import { appointmentFormDefaultValues, type AppointmentFormValues } from '../../schemas/appointment-form.schema'
import { mapFormToPayload } from '../../utils/appointment-mappers'
import { isCreatableDay, startOfDay, toDateKey } from '../../utils/calendar-dates'
import type { AppointmentFilters } from '../../utils/filter-appointments'
import type { Appointment } from '../../types'
import { AppointmentFormModal } from '../AppointmentFormModal'
import { AgendaAppointmentSheet } from './AgendaAppointmentSheet'
import { AgendaDayStrip } from './AgendaDayStrip'
import { AgendaFilters } from './AgendaFilters'
import { AgendaMonthGrid } from './AgendaMonthGrid'
import { AgendaViewBody, type AgendaView } from './AgendaViewBody'

// En la agenda se ven todas las citas salvo las canceladas.
const AGENDA_FILTERS: AppointmentFilters = {
  scope: 'all',
  q: '',
  from: '',
  to: '',
  statuses: ['scheduled', 'confirmed', 'in_progress', 'completed'],
  modality: '',
  specialistId: '',
  confirmation: '',
}

// Agenda de la app instalable (PWA): día / semana / mes, confirmar y agendar.
export function MobileAgendaPage() {
  const [view, setView] = useState<AgendaView>('day')
  const [selected, setSelected] = useState(() => startOfDay(new Date()))
  const [filters, setFilters] = useState(AGENDA_FILTERS)
  const [openId, setOpenId] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState<Appointment | null>(null)
  const [draft, setDraft] = useState<AppointmentFormValues | null>(null)
  const agenda = useAgendaAppointments(filters, selected, view === 'month' ? 'month' : 'week')

  const createMutation = useCreateAppointment({ onSuccess: () => setDraft(null) })
  const cancelMutation = useCancelAppointment({ onSuccess: () => setCancelling(null) })
  const openAppointment = agenda.all.find((a) => a.id === openId) ?? null
  const select = (day: Date) => setSelected(startOfDay(day))
  const openDay = (day: Date) => {
    select(day)
    setView('day')
  }
  const createAt = (date: string, time: string) =>
    setDraft({ ...appointmentFormDefaultValues, date, time, specialistId: agenda.me?.specialistId ?? 0 })

  return (
    <>
      <Box sx={{ px: 2, pt: 1.5, bgcolor: 'background.paper' }}>
        <ToggleButtonGroup fullWidth size="small" exclusive value={view} onChange={(_e, value: AgendaView | null) => value && setView(value)}>
          <ToggleButton value="day">Día</ToggleButton>
          <ToggleButton value="week">Semana</ToggleButton>
          <ToggleButton value="month">Mes</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {view === 'month' ? (
        <AgendaMonthGrid selected={selected} countByDay={agenda.countByDay} onSelect={select} onOpenDay={openDay} />
      ) : (
        <AgendaDayStrip selected={selected} busyDays={new Set(agenda.countByDay.keys())} onSelect={select} />
      )}
      <AgendaFilters
        filters={filters}
        showConfirmation={agenda.canViewUnconfirmed}
        showDoctor={agenda.canViewAll}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />

      <QueryBoundary isLoading={agenda.isLoading} isError={agenda.isError} error={agenda.error}>
        {view !== 'month' && (
          <AgendaViewBody
            view={view}
            selected={selected}
            dayAppointments={agenda.dayAppointments}
            periodAppointments={agenda.periodAppointments}
            showDoctor={agenda.canViewAll}
            onOpen={setOpenId}
            onShowDay={openDay}
            onCreateAt={agenda.me?.permissions.includes('citas:create') ? createAt : undefined}
          />
        )}
      </QueryBoundary>

      {agenda.me?.permissions.includes('citas:create') && (
        <Fab
          color="primary"
          aria-label="Agendar cita"
          onClick={() => createAt(toDateKey(isCreatableDay(selected) ? selected : new Date()), '09:00')}
          sx={{ position: 'fixed', right: 20, bottom: 'calc(env(safe-area-inset-bottom) + 76px)' }}
        >
          <AddIcon />
        </Fab>
      )}

      <AgendaAppointmentSheet appointment={openAppointment} onClose={() => setOpenId(null)} onCancel={setCancelling} />
      <AppointmentFormModal
        open={draft !== null}
        mode="create"
        initialValues={draft ?? undefined}
        isSubmitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(mapFormToPayload(values))}
        onClose={() => setDraft(null)}
      />
      <ConfirmDialog
        open={cancelling !== null}
        title="Cancelar cita"
        description={`¿Cancelar la cita de ${cancelling?.patientName ?? 'este paciente'}?`}
        confirmLabel="Cancelar cita"
        isConfirming={cancelMutation.isPending}
        onConfirm={() => {
          if (!cancelling) return
          cancelMutation.mutate(cancelling.id)
          setOpenId(null)
        }}
        onClose={() => setCancelling(null)}
      />
    </>
  )
}
