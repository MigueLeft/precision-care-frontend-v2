import { useState } from 'react'
import { Box, Stack, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ViewListIcon from '@mui/icons-material/ViewList'
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useMe, useSpecialistsLookup } from '@/features/identity'
import { useAppointments } from '../hooks/useAppointments'
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
import { AppointmentsTable } from './AppointmentsTable'
import { AppointmentFormModal } from './AppointmentFormModal'
import { AppointmentDetailDrawer } from './AppointmentDetailDrawer'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'

export function AppointmentsPage() {
  const { data: appointments = [], isLoading, isError, error } = useAppointments()
  const { data: specialists = [] } = useSpecialistsLookup()
  const { data: me } = useMe()

  const [filters, setFilters] = useState<AppointmentFilters>(defaultAppointmentFilters)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [cancelingId, setCancelingId] = useState<number | null>(null)

  const createMutation = useCreateAppointment({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateAppointment({ onSuccess: () => setEditingId(null) })
  const cancelMutation = useCancelAppointment({ onSuccess: () => setCancelingId(null) })

  const editing = appointments.find((a) => a.id === editingId) ?? null
  const filtered = filterAppointments(appointments, filters, me?.specialistId ?? null)

  function handleSubmit(values: AppointmentFormValues) {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: mapFormToPayload(values) })
    } else {
      createMutation.mutate(mapFormToPayload(values))
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
        <Typography variant="h1">Citas</Typography>
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsCreateOpen(true)}
        >
          Nueva cita
        </AppButton>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {filtered.length} citas con los filtros actuales.
        </Typography>
        <ToggleButtonGroup size="small" exclusive value="list">
          <ToggleButton value="list">
            <ViewListIcon sx={{ fontSize: 16, mr: 0.5 }} /> Lista
          </ToggleButton>
          <ToggleButton value="week" disabled>
            <CalendarViewWeekIcon sx={{ fontSize: 16, mr: 0.5 }} /> Semana
          </ToggleButton>
          <ToggleButton value="month" disabled>
            <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} /> Mes
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <AppointmentsToolbar
        filters={filters}
        specialists={specialists}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />

      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        <AppointmentsTable appointments={filtered} onView={(id) => setViewingId(id)} />
      </QueryBoundary>

      <AppointmentFormModal
        open={isCreateOpen || editingId !== null}
        mode={editingId ? 'edit' : 'create'}
        initialValues={editing ? mapAppointmentToForm(editing) : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsCreateOpen(false)
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
