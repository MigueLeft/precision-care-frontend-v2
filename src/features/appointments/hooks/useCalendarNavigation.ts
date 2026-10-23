import { useState } from 'react'
import { shiftAnchor, startOfDay, visibleRange, type CalendarView } from '../utils/calendar-dates'

// Vista activa (lista/día/semana/mes) y fecha de referencia del calendario.
export function useCalendarNavigation(initialView: CalendarView = 'week') {
  const [view, setView] = useState<CalendarView>(initialView)
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()))

  return {
    view,
    anchor,
    range: visibleRange(view, anchor),
    setView,
    goToday: () => setAnchor(startOfDay(new Date())),
    navigate: (direction: 1 | -1) => setAnchor((current) => shiftAnchor(view, current, direction)),
    // Clic en el número de un día o "+N más": abre la vista de ese día.
    showDay: (day: Date) => {
      setAnchor(startOfDay(day))
      setView('day')
    },
  }
}
