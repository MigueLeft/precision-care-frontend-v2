import { api } from '@/utils/api'
import type { DeliverableTemplate } from '../types'

export async function fetchDeliverableTemplates(): Promise<DeliverableTemplate[]> {
  const { data } = await api.get<{ templates: DeliverableTemplate[] }>('/deliverable-templates')
  return data.templates
}

// Solo se editan los textos de la plantilla (base_structure).
export async function updateDeliverableTemplate(
  id: number,
  baseStructure: Record<string, string>,
): Promise<DeliverableTemplate> {
  const { data } = await api.patch<{ template: DeliverableTemplate }>(
    `/deliverable-templates/${id}`,
    { baseStructure },
  )
  return data.template
}
