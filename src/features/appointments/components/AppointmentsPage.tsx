import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewAllAppointments, useMe, useSpecialistsLookup } from '@/features/identity'
import { useAppointments } from '../hooks/useAppointments'
import { useCalendarNavigation } from '../hooks/useCalendarNavigation'
import {
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
} from '../hooks/useAppointmentMutations'
import {
  defaultAppointmentFilters,
  filterAppointments,
  type AppointmentFilters,
} from '../utils/filter-appointments'
import { mapFormToPayload, mapAppointmentToForm } from '../utils/appointment-mappers'
import { AppointmentsToolbar } from './AppointmentsToolbar'
import { AppointmentsViewBody } from './AppointmentsViewBody'
import { AppointmentFormModal } from './AppointmentFormModal'
import { AppointmentDetailDrawer } from './AppointmentDetailDrawer'
import { CalendarHeader } from './calendar/CalendarHeader'
import { SpecialistLegend } from './calendar/SpecialistLegend'
import {
  appointmentFormDefaultValues,
  type AppointmentFormValues,
} from '../schemas/appointment-form.schema'

export function AppointmentsPage() {
  const { data: appointments = [], isLoading, isError, error } = useAppointments()
  const { data: specialists = [] } = useSpecialistsLookup()
  const { data: me } = useMe()
  const calendar = useCalendarNavigation()

  const [filters, setFilters] = useState<AppointmentFilters>(defaultAppointmentFilters)
  // Valores iniciales al crear (clic en un hueco del calendario: fecha y hora).
  const [createDraft, setCreateDraft] = useState<AppointmentFormValues | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [cancelingId, setCancelingId] = useState<number | null>(null)

  const createMutation = useCreateAppointment({ onSuccess: () => setCreateDraft(null) })
  const updateMutation = useUpdateAppointment({ onSuccess: () => setEditingId(null) })
  const cancelMutation = useCancelAppointment({ onSuccess: () => setCancelingId(null) })

  const editing = appointments.find((a) => a.id === editingId) ?? null
  const canViewAll = canViewAllAppointments(me)
  const isCalendar = calendar.view !== 'list'
  const filtered = filterAppointments(appointments, filters, {
    mySpecialistId: me?.specialistId ?? null,
    restrictToMine: !canViewAll,
    range: calendar.range,
  })
  const updateFilters = (patch: Partial<AppointmentFilters>) => setFilters((prev) => ({ ...prev, ...patch }))
  // Las citas se agendan a partir de hoy: los huecos del pasado no crean citas.
  const today = new Date().toLocaleDateString('en-CA')
  const createAt = (date: string, time: string) =>
    date >= today && setCreateDraft({ ...appointmentFormDefaultValues, date, time })

  function handleSubmit(values: AppointmentFormValues) {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: mapFormToPayload(values) })
    } else {
      createMutation.mutate(mapFormToPayload(values))
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography variant="h1">Citas</Typography>
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setCreateDraft(appointmentFormDefaultValues)}
        >
          Nueva cita
        </AppButton>
      </Stack>

      <AppointmentsToolbar
        filters={filters}
        specialists={specialists}
        isSpecialist={!canViewAll}
        showDateRange={!isCalendar}
        onChange={updateFilters}
      />

      <CalendarHeader
        view={calendar.view}
        anchor={calendar.anchor}
        count={filtered.length}
        onViewChange={calendar.setView}
        onToday={calendar.goToday}
        onNavigate={calendar.navigate}
      />
      {isCalendar && canViewAll && (
        <SpecialistLegend
          specialists={specialists}
          selectedId={filters.specialistId}
          onSelect={(specialistId) => updateFilters({ specialistId })}
        />
      )}

      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        <AppointmentsViewBody
          view={calendar.view}
          anchor={calendar.anchor}
          appointments={filtered}
          onOpen={setViewingId}
          onShowDay={calendar.showDay}
          onCreateAt={createAt}
        />
      </QueryBoundary>

      <AppointmentFormModal
        open={createDraft !== null || editingId !== null}
        mode={editingId ? 'edit' : 'create'}
        initialValues={editing ? mapAppointmentToForm(editing) : (createDraft ?? undefined)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setCreateDraft(null)
          setEditingId(null)
        }}
      />

      <AppointmentDetailDrawer
        appointmentId={viewingId}
        onClose={() => setViewingId(null)}
        onEdit={(id) => {
          setViewingId(null)
          setEditingId(id)
        }}
        onCancel={(id) => setCancelingId(id)}
      />

      <ConfirmDialog
        open={cancelingId !== null}
        title="Cancelar cita"
        description="¿Cancelar esta cita? El paciente y el especialista dejarán de verla como activa."
        confirmLabel="Cancelar cita"
        isConfirming={cancelMutation.isPending}
        onConfirm={() => cancelingId && cancelMutation.mutate(cancelingId)}
        onClose={() => setCancelingId(null)}
      />
    </Box>
  )
}
