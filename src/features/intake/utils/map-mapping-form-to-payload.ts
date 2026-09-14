import type { MappingFormValues } from '../schemas/mapping-form.schema'
import type { IntakeMapping } from '../types'

export function mapMappingFormToPayload(values: MappingFormValues) {
  return {
    scoringType: values.scoringType,
    destinationType: values.destinationType,
    destinationTable: values.destinationTable || undefined,
    destinationField: values.destinationField || undefined,
    handlerName: values.handlerName || undefined,
    parameters: values.parametersJson ? JSON.parse(values.parametersJson) : undefined,
  }
}

export function mapMappingToFormValues(mapping: IntakeMapping): MappingFormValues {
  return {
    scoringType: mapping.scoringType,
    destinationType: mapping.destinationType,
    destinationTable: mapping.destinationTable ?? '',
    destinationField: mapping.destinationField ?? '',
    handlerName: mapping.handlerName ?? '',
    parametersJson: mapping.parameters ? JSON.stringify(mapping.parameters, null, 2) : '',
  }
}
