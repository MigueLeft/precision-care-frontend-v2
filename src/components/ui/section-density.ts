import { createContext } from 'react'

// Densidad de las secciones plegables: "compact" reduce cabeceras y márgenes
// (vista de consulta, donde hay muchos apartados).
export type SectionDensity = 'comfortable' | 'compact'

export const SectionDensityContext = createContext<SectionDensity>('comfortable')
