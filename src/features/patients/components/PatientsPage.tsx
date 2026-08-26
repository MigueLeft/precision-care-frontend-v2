import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useCountries } from '@/features/catalogs'
import { usePatients } from '../hooks/usePatients'
import { useCreatePatient } from '../hooks/useCreatePatient'
import { useUpdatePatient } from '../hooks/useUpdatePatient'
import { useDeletePatient } from '../hooks/useDeletePatient'
import { filterPatients } from '../utils/filter-patients'
import { formatPatientName } from '../utils/patient-format'
import { mapPatientToFormValues } from '../utils/map-patient-to-form-values'
import { mapFormValuesToDto } from '../utils/map-form-values-to-dto'
import { patientFormDefaultValues } from '../schemas/patient-form.schema'
import { PatientsToolbar } from './PatientsToolbar'
import { PatientsTable } from './PatientsTable'
import { PatientFormModal } from './PatientFormModal'
import { DeletePatientDialog } from './DeletePatientDialog'
import { PatientDetailDrawer } from './PatientDetailDrawer'
import type { PatientsListSearch } from '../schemas/patients-list-search.schema'

interface PatientsPageProps {
  searchParams: PatientsListSearch
  onSearchParamsChange: (next: Partial<PatientsListSearch>) => void
}

export function PatientsPage({ searchParams, onSearchParamsChange }: PatientsPageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null)
  const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null)

  const { data: patients = [] } = usePatients()
  const { data: countries = [] } = useCountries()

  const countryNameById = new Map(countries.map((country) => [country.id, country.name]))
  const filteredPatients = filterPatients(patients, searchParams)
  const drawerPatient = patients.find((patient) => patient.id === searchParams.patientId) ?? null
  const editingPatient = patients.find((patient) => patient.id === editingPatientId) ?? null
  const deletingPatient = patients.find((patient) => patient.id === deletingPatientId) ?? null

  const createMutation = useCreatePatient({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdatePatient(editingPatientId ?? undefined, {
    onSuccess: () => setEditingPatientId(null),
  })
  const deleteMutation = useDeletePatient({ onSuccess: () => setDeletingPatientId(null) })

  const isFormOpen = isCreateOpen || editingPatientId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues = isCreateOpen
    ? patientFormDefaultValues
    : editingPatient
      ? mapPatientToFormValues(editingPatient)
      : patientFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingPatientId(null)
  }

  function handleFormSubmit(values: Parameters<typeof mapFormValuesToDto>[0]) {
    const dto = mapFormValuesToDto(values)
    if (isCreateOpen) {
      createMutation.mutate(dto)
    } else if (editingPatientId) {
      updateMutation.mutate(dto)
    }
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Pacientes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestiona y consulta el directorio de pacientes de la clínica. {filteredPatients.length}{' '}
        resultados con los filtros actuales.
      </Typography>

      <PatientsToolbar
        q={searchParams.q ?? ''}
        nationalityCountryId={searchParams.nationalityCountryId}
        countries={countries}
        onQChange={(value) => onSearchParamsChange({ q: value || undefined })}
        onNationalityChange={(value) => onSearchParamsChange({ nationalityCountryId: value })}
        onNewPatient={() => setIsCreateOpen(true)}
      />

      <PatientsTable
        patients={filteredPatients}
        countryNameById={countryNameById}
        onView={(id) => onSearchParamsChange({ patientId: id })}
        onEdit={(id) => setEditingPatientId(id)}
        onDelete={(id) => setDeletingPatientId(id)}
      />

      <PatientFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        countries={countries}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={closeForm}
      />

      <DeletePatientDialog
        open={deletingPatientId !== null}
        patientName={deletingPatient ? formatPatientName(deletingPatient) : undefined}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deletingPatientId && deleteMutation.mutate(deletingPatientId)}
        onClose={() => setDeletingPatientId(null)}
      />

      <PatientDetailDrawer
        patient={drawerPatient}
        countryNameById={countryNameById}
        onClose={() => onSearchParamsChange({ patientId: undefined })}
        onEditRequest={() => setEditingPatientId(searchParams.patientId ?? null)}
      />
    </Box>
  )
}
