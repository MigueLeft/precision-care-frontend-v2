import { Stack, Typography } from '@mui/material'
import { useDeliverableTemplates } from '../../hooks/useDeliverableTemplates'
import { TemplateTextsForm, type TemplateTextField } from './TemplateTextsForm'

const PRESCRIPTION_FIELDS: TemplateTextField[] = [
  { key: 'recipeTitle', label: 'Título de la hoja del récipe', helper: 'Media hoja con los medicamentos.' },
  { key: 'indicationsTitle', label: 'Título de la hoja de indicaciones', helper: 'Media hoja para el paciente.' },
]

const LAB_ORDER_FIELDS: TemplateTextField[] = [
  { key: 'headerTitle', label: 'Nombre del laboratorio' },
  { key: 'headerSubtitle', label: 'Razón social' },
  { key: 'headerLines', label: 'Dirección, teléfonos y RIF', multiline: true, helper: 'Una línea por renglón.' },
  { key: 'documentTitle', label: 'Título de la orden' },
]

const STUDY_ORDER_FIELDS: TemplateTextField[] = [
  { key: 'requestLabel', label: 'Texto antes de los estudios', helper: 'Por ejemplo: Favor practicar.' },
]

// Textos de las plantillas del récipe y la orden de laboratorio. El membrete
// del récipe (títulos, CI/MSDS/CML, dirección) sale de cada especialista.
export function TemplatesTab() {
  const { data: templates = [], isLoading } = useDeliverableTemplates()
  const prescription = templates.find((template) => template.type === 'prescription')
  const labOrder = templates.find((template) => template.type === 'lab_order')
  const studyOrder = templates.find((template) => template.type === 'study_order')

  if (isLoading) return null
  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Todos se imprimen en hoja carta partida a la mitad. El membrete del récipe y de la orden de
        estudio (títulos, registros, dirección y teléfono) se edita en la ficha de cada especialista.
      </Typography>
      {prescription && (
        <TemplateTextsForm title="Récipe médico" template={prescription} fields={PRESCRIPTION_FIELDS} />
      )}
      {labOrder && (
        <TemplateTextsForm title="Orden de laboratorio" template={labOrder} fields={LAB_ORDER_FIELDS} />
      )}
      {studyOrder && (
        <TemplateTextsForm title="Orden de estudio" template={studyOrder} fields={STUDY_ORDER_FIELDS} />
      )}
    </Stack>
  )
}
