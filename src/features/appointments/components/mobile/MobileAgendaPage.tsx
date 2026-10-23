import { useState } from 'react'
import { Fab, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewAllAppointments, canViewUnconfirmedAppointments, useMe } from '@/features/identity'
import { useAppointments } from '../../hooks/useAppointments'
import { useCancelAppointment, useCreateAppointment } from '../../hooks/useAppointmentMutations'
import { appointmentFormDefaultValues, type AppointmentFormValues } from '../../schemas/appointment-form.schema'
import { mapFormToPayload } from '../../utils/appointment-mappers'
import { isCreatableDay, startOfDay, toDateKey, visibleRange } from '../../utils/calendar-dates'
import { filterAppointments, type AppointmentFilters } from '../../utils/filter-appointments'
import { AppointmentFormModal } from '../AppointmentFormModal'
import type { Appointment } from '../../types'
import { AgendaAppointmentCard } from './AgendaAppointmentCard'
import { AgendaAppointmentSheet } from './AgendaAppointmentSheet'
import { AgendaDayStrip } from './AgendaDayStrip'
import { AgendaFilters } from './AgendaFilters'

// En la agenda se ven todas las citas del día salvo las canceladas.
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

// Agenda de la app instalable (PWA): citas del día, confirmar y agendar.
export function MobileAgendaPage() {
  const { data: appointments = [], isLoading, isError, error } = useAppointments()
  const { data: me } = useMe()
  const [selected, setSelected] = useState(() => startOfDay(new Date()))
  const [filters, setFilters] = useState(AGENDA_FILTERS)
  const [open, setOpen] = useState<Appointment | null>(null)
  const [cancelling, setCancelling] = useState<Appointment | null>(null)
  const [draft, setDraft] = useState<AppointmentFormValues | null>(null)

  const createMutation = useCreateAppointment({ onSuccess: () => setDraft(null) })
  const cancelMutation = useCancelAppointment({ onSuccess: () => setCancelling(null) })
  const canViewAll = canViewAllAppointments(me)
  const canViewUnconfirmed = canViewUnconfirmedAppointments(me)
  const context = { mySpecialistId: me?.specialistId ?? null, restrictToMine: !canViewAll, hideUnconfirmed: !canViewUnconfirmed }

  // Puntos de la tira: días de la semana con citas (con los mismos filtros).
  const weekAppointments = filterAppointments(appointments, filters, { ...context, range: visibleRange('week', selected) })
  const busyDays = new Set(weekAppointments.map((a) => toDateKey(new Date(a.startAtUtc))))
  const dayAppointments = filterAppointments(appointments, filters, { ...context, range: visibleRange('day', selected) }).sort(
    (a, b) => new Date(a.startAtUtc).getTime() - new Date(b.startAtUtc).getTime(),
  )
  // La hoja muestra la versión más reciente de la cita (tras confirmar, etc.).
  const openAppointment = open ? (appointments.find((a) => a.id === open.id) ?? null) : null

  return (
    <>
      <AgendaDayStrip selected={selected} busyDays={busyDays} onSelect={(day) => setSelected(startOfDay(day))} />
      <AgendaFilters
        filters={filters}
        showConfirmation={canViewUnconfirmed}
        showDoctor={canViewAll}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />

      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        <Stack spacing={1.25} sx={{ px: 2, pt: 1.5 }}>
          {dayAppointments.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '14px', py: 6 }}>
              No hay citas para este día.
            </Typography>
          ) : (
            dayAppointments.map((appointment) => (
              <AgendaAppointmentCard key={appointment.id} appointment={appointment} showDoctor={canViewAll} onOpen={setOpen} />
            ))
          )}
        </Stack>
      </QueryBoundary>

      {me?.permissions.includes('citas:create') && (
        <Fab
          color="primary"
          aria-label="Agendar cita"
          onClick={() =>
            setDraft({
              ...appointmentFormDefaultValues,
              date: toDateKey(isCreatableDay(selected) ? selected : new Date()),
              specialistId: me.specialistId ?? 0,
            })
          }
          sx={{ position: 'fixed', right: 20, bottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
        >
          <AddIcon />
        </Fab>
      )}

      <AgendaAppointmentSheet appointment={openAppointment} onClose={() => setOpen(null)} onCancel={setCancelling} />

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
          setOpen(null)
        }}
        onClose={() => setCancelling(null)}
      />
    </>
  )
}
