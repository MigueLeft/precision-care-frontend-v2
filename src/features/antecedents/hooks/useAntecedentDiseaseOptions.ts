import { useDiseases } from '@/features/catalogs'
import type { CatalogOption } from '@/components/ui/CatalogSearchInput'

// Opciones para capturar antecedentes familiares y personales: el catálogo de
// enfermedades activo. El nombre cotidiano va como alias (se muestra bajo el
// nombre y también sirve para buscar).
export function useAntecedentDiseaseOptions(): CatalogOption[] {
  const { data: diseases = [] } = useDiseases()
  return diseases
    .filter((disease) => disease.active)
    .map((disease) => ({
      id: disease.id,
      name: disease.name,
      alias:
        disease.commonName && disease.commonName.toLowerCase() !== disease.name.toLowerCase()
          ? disease.commonName
          : undefined,
    }))
}
