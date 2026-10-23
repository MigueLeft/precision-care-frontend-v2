import { useState } from 'react'
import { Box, Fab, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import SearchIcon from '@mui/icons-material/Search'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useCountries } from '@/features/catalogs'
import { useMe } from '@/features/identity'
import { useCreatePatient } from '../../hooks/useCreatePatient'
import { usePatients } from '../../hooks/usePatients'
import { patientFormDefaultValues } from '../../schemas/patient-form.schema'
import { filterPatients } from '../../utils/filter-patients'
import { mapFormValuesToDto } from '../../utils/map-form-values-to-dto'
import { formatPatientName } from '../../utils/patient-format'
import { PatientFormModal } from '../PatientFormModal'
import { MobilePatientCard } from './MobilePatientCard'

// Cuántos se muestran sin buscar (los más recientes primero).
const MAX_VISIBLE = 50

// Pacientes en la app de citas: buscar, ver contacto y registrar nuevos.
// Sin acceso al expediente clínico.
export function MobilePatientsPage() {
  const { data: patients = [], isLoading, isError, error } = usePatients()
  const { data: countries = [] } = useCountries()
  const { data: me } = useMe()
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(false)
  const createMutation = useCreatePatient({ onSuccess: () => setCreating(false) })

  const matches = filterPatients(patients, { q }).sort((a, b) =>
    q ? formatPatientName(a).localeCompare(formatPatientName(b), 'es') : b.id - a.id,
  )
  const visible = matches.slice(0, MAX_VISIBLE)

  return (
    <>
      <Box sx={{ px: 2, pt: 1.5, pb: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre, correo o teléfono…"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.75 }}>
          {q ? `${matches.length} resultados` : `${patients.length} pacientes · los más recientes primero`}
        </Typography>
      </Box>

      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        <Stack spacing={1} sx={{ px: 2, pt: 1.5 }}>
          {visible.map((patient) => (
            <MobilePatientCard key={patient.id} patient={patient} />
          ))}
          {matches.length > MAX_VISIBLE && (
            <Typography sx={{ textAlign: 'center', fontSize: '12.5px', color: 'text.secondary', py: 1 }}>
              Escribe en el buscador para encontrar a los demás pacientes.
            </Typography>
          )}
          {matches.length === 0 && (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '14px', py: 6 }}>
              No se encontraron pacientes.
            </Typography>
          )}
        </Stack>
      </QueryBoundary>

      {me?.permissions.includes('pacientes:create') && (
        <Fab
          color="primary"
          variant="extended"
          onClick={() => setCreating(true)}
          sx={{ position: 'fixed', right: 20, bottom: 'calc(env(safe-area-inset-bottom) + 76px)' }}
        >
          <PersonAddAlt1OutlinedIcon sx={{ mr: 1 }} />
          Nuevo paciente
        </Fab>
      )}

      <PatientFormModal
        open={creating}
        mode="create"
        initialValues={patientFormDefaultValues}
        countries={countries}
        isSubmitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(mapFormValuesToDto(values))}
        onClose={() => setCreating(false)}
      />
    </>
  )
}
