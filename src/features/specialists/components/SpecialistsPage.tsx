import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useSpecialists } from '../hooks/useSpecialists'
import { useSetSpecialistStatus } from '../hooks/useSpecialistMutations'
import { filterSpecialists } from '../utils/filter-specialists'
import { SpecialistsStats } from './SpecialistsStats'
import { SpecialistsToolbar } from './SpecialistsToolbar'
import type { SpecialistStatusFilter } from './SpecialistsToolbar'
import { SpecialistsTable } from './SpecialistsTable'
import { DeactivateSpecialistDialog } from './DeactivateSpecialistDialog'
import type { Specialist } from '../types'

export function SpecialistsPage() {
  const navigate = useNavigate()
  const { data: specialists = [] } = useSpecialists()

  const [q, setQ] = useState('')
  const [specialtyId, setSpecialtyId] = useState<number>()
  const [status, setStatus] = useState<SpecialistStatusFilter>('all')
  const [toggling, setToggling] = useState<Specialist | null>(null)

  const statusMutation = useSetSpecialistStatus({ onSuccess: () => setToggling(null) })

  const filtered = filterSpecialists(specialists, { q, specialtyId, status })

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Especialistas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Profesionales registrados en la clínica y su acceso al sistema.
      </Typography>

      <SpecialistsStats specialists={specialists} />

      <SpecialistsToolbar
        q={q}
        specialtyId={specialtyId}
        status={status}
        onQChange={setQ}
        onSpecialtyChange={setSpecialtyId}
        onStatusChange={setStatus}
      />

      <SpecialistsTable
        specialists={filtered}
        onView={(id) =>
          navigate({ to: '/especialistas/$specialistId', params: { specialistId: String(id) } })
        }
        onToggleStatus={setToggling}
      />

      <DeactivateSpecialistDialog
        specialist={toggling}
        isSubmitting={statusMutation.isPending}
        onConfirm={() =>
          toggling && statusMutation.mutate({ id: toggling.id, active: !toggling.active })
        }
        onClose={() => setToggling(null)}
      />
    </Box>
  )
}
