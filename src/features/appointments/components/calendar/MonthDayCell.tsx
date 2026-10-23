import { alpha, Box, ButtonBase, Stack, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Appointment } from '../../types'
import { isCreatableDay, toDateKey } from '../../utils/calendar-dates'
import { CalendarEventCard } from './CalendarEventCard'

// Citas visibles por día antes del "+N más".
const MAX_PER_DAY = 3

type MonthDayCellProps = {
  day: Date
  inMonth: boolean
  isToday: boolean
  appointments: Appointment[]
  onOpen: (id: number) => void
  onShowDay: (day: Date) => void
  onCreateAt?: (date: string, time: string) => void
}

// Un día del mes: número (abre el día), sus citas y, al pasar el puntero en
// días de hoy en adelante, un "+" para agregar una cita.
export function MonthDayCell({ day, inMonth, isToday, appointments, onOpen, onShowDay, onCreateAt }: MonthDayCellProps) {
  const canCreate = !!onCreateAt && isCreatableDay(day)
  const visible = appointments.slice(0, MAX_PER_DAY)
  const hidden = appointments.length - visible.length
  const create = () => canCreate && onCreateAt?.(toDateKey(day), '09:00')

  return (
    <Box
      onClick={create}
      sx={{
        position: 'relative',
        minHeight: 118,
        p: 0.5,
        minWidth: 0,
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: inMonth ? 'background.paper' : 'action.hover',
        cursor: canCreate ? 'pointer' : 'default',
        transition: 'background-color 120ms',
        '& .add-hint': { opacity: 0 },
        '&:hover': canCreate
          ? { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06), '& .add-hint': { opacity: 1 } }
          : undefined,
      }}
    >
      {canCreate && (
        <Tooltip title="Agregar cita">
          <Box
            className="add-hint"
            sx={{
              position: 'absolute',
              top: 6,
              left: 6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              transition: 'opacity 120ms',
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </Box>
        </Tooltip>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
        <ButtonBase
          onClick={(event) => {
            event.stopPropagation()
            onShowDay(day)
          }}
          aria-label={`Ver el día ${day.getDate()}`}
          sx={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            fontSize: '12px',
            fontWeight: isToday ? 700 : 500,
            bgcolor: isToday ? 'primary.main' : 'transparent',
            color: isToday ? 'primary.contrastText' : inMonth ? 'text.primary' : 'text.disabled',
            '&:hover': { bgcolor: isToday ? 'primary.dark' : 'action.selected' },
          }}
        >
          {day.getDate()}
        </ButtonBase>
      </Box>

      <Stack spacing={0.375}>
        {visible.map((appointment) => (
          <CalendarEventCard key={appointment.id} appointment={appointment} compact onClick={onOpen} />
        ))}
        {hidden > 0 && (
          <ButtonBase
            onClick={(event) => {
              event.stopPropagation()
              onShowDay(day)
            }}
            sx={{ justifyContent: 'flex-start', px: 0.75, borderRadius: '4px', fontSize: '12px', fontWeight: 600, color: 'text.secondary', '&:hover': { bgcolor: 'action.selected' } }}
          >
            +{hidden} más
          </ButtonBase>
        )}
      </Stack>
    </Box>
  )
}
