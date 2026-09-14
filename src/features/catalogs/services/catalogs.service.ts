import { api } from '@/utils/api'
import type {
  Country,
  State,
  City,
  CivilStatus,
  Race,
  SocioeconomicLevel,
  Language,
  BodySystem,
  ParaclinicalCategoryCatalog,
  CreateParaclinicalCategoryPayload,
  UpdateParaclinicalCategoryPayload,
  MedicationPresentation,
  MedicationCategory,
  MedicalSpecialty,
  AllergyType,
  AllergySeverity,
  SymptomSeverity,
  AllergyCatalog,
  CreateAllergyCatalogPayload,
  UpdateAllergyCatalogPayload,
  Disease,
  CreateDiseasePayload,
  UpdateDiseasePayload,
  AntecedentFamilyCatalog,
  AntecedentPersonalCatalog,
  SurgeryCatalog,
  HospitalizationCatalog,
} from '../types'

export async function fetchCountries(): Promise<Country[]> {
  const { data } = await api.get<{ countries: Country[] }>('/catalogs/countries')
  return data.countries
}

export interface CountryPayload {
  name: string
  nationalityName?: string
}

export async function createCountry(payload: CountryPayload): Promise<Country> {
  const { data } = await api.post<{ country: Country }>('/catalogs/countries', payload)
  return data.country
}

export async function updateCountry(id: number, payload: CountryPayload): Promise<Country> {
  const { data } = await api.patch<{ country: Country }>(`/catalogs/countries/${id}`, payload)
  return data.country
}

// ─── Estados / provincias ───────────────────────────────────────────────────

export async function fetchStates(countryId?: number): Promise<State[]> {
  const { data } = await api.get<{ states: State[] }>('/catalogs/states', {
    params: countryId ? { countryId } : undefined,
  })
  return data.states
}

export async function createState(payload: { name: string; countryId: number }): Promise<State> {
  const { data } = await api.post<{ state: State }>('/catalogs/states', payload)
  return data.state
}

export async function updateState(id: number, payload: { name: string }): Promise<State> {
  const { data } = await api.patch<{ state: State }>(`/catalogs/states/${id}`, payload)
  return data.state
}

export async function toggleStateActive(id: number): Promise<State> {
  const { data } = await api.patch<{ state: State }>(`/catalogs/states/${id}/toggle-active`)
  return data.state
}

// ─── Ciudades ───────────────────────────────────────────────────────────────

export async function fetchCities(stateId?: number): Promise<City[]> {
  const { data } = await api.get<{ cities: City[] }>('/catalogs/cities', {
    params: stateId ? { stateId } : undefined,
  })
  return data.cities
}

export async function createCity(payload: { name: string; stateId: number }): Promise<City> {
  const { data } = await api.post<{ city: City }>('/catalogs/cities', payload)
  return data.city
}

export async function updateCity(id: number, payload: { name: string }): Promise<City> {
  const { data } = await api.patch<{ city: City }>(`/catalogs/cities/${id}`, payload)
  return data.city
}

export async function toggleCityActive(id: number): Promise<City> {
  const { data } = await api.patch<{ city: City }>(`/catalogs/cities/${id}/toggle-active`)
  return data.city
}

export async function fetchCivilStatuses(): Promise<CivilStatus[]> {
  const { data } = await api.get<{ civilStatuses: CivilStatus[] }>('/catalogs/civil-statuses')
  return data.civilStatuses
}

export async function createCivilStatus(name: string): Promise<CivilStatus> {
  const { data } = await api.post<{ civilStatus: CivilStatus }>('/catalogs/civil-statuses', { name })
  return data.civilStatus
}

export async function updateCivilStatus(id: number, name: string): Promise<CivilStatus> {
  const { data } = await api.patch<{ civilStatus: CivilStatus }>(`/catalogs/civil-statuses/${id}`, { name })
  return data.civilStatus
}

export async function toggleCivilStatusActive(id: number): Promise<CivilStatus> {
  const { data } = await api.patch<{ civilStatus: CivilStatus }>(
    `/catalogs/civil-statuses/${id}/toggle-active`,
  )
  return data.civilStatus
}

export async function fetchRaces(): Promise<Race[]> {
  const { data } = await api.get<{ races: Race[] }>('/catalogs/races')
  return data.races
}

export async function createRace(name: string): Promise<Race> {
  const { data } = await api.post<{ race: Race }>('/catalogs/races', { name })
  return data.race
}

export async function updateRace(id: number, name: string): Promise<Race> {
  const { data } = await api.patch<{ race: Race }>(`/catalogs/races/${id}`, { name })
  return data.race
}

export async function toggleRaceActive(id: number): Promise<Race> {
  const { data } = await api.patch<{ race: Race }>(`/catalogs/races/${id}/toggle-active`)
  return data.race
}

export async function fetchSocioeconomicLevels(): Promise<SocioeconomicLevel[]> {
  const { data } = await api.get<{ socioeconomicLevels: SocioeconomicLevel[] }>(
    '/catalogs/socioeconomic-levels',
  )
  return data.socioeconomicLevels
}

export async function createSocioeconomicLevel(name: string): Promise<SocioeconomicLevel> {
  const { data } = await api.post<{ socioeconomicLevel: SocioeconomicLevel }>(
    '/catalogs/socioeconomic-levels',
    { name },
  )
  return data.socioeconomicLevel
}

export async function updateSocioeconomicLevel(id: number, name: string): Promise<SocioeconomicLevel> {
  const { data } = await api.patch<{ socioeconomicLevel: SocioeconomicLevel }>(
    `/catalogs/socioeconomic-levels/${id}`,
    { name },
  )
  return data.socioeconomicLevel
}

export async function toggleSocioeconomicLevelActive(id: number): Promise<SocioeconomicLevel> {
  const { data } = await api.patch<{ socioeconomicLevel: SocioeconomicLevel }>(
    `/catalogs/socioeconomic-levels/${id}/toggle-active`,
  )
  return data.socioeconomicLevel
}

export async function fetchLanguages(): Promise<Language[]> {
  const { data } = await api.get<{ languages: Language[] }>('/catalogs/languages')
  return data.languages
}

export async function createLanguage(payload: { name: string; isoCode: string }): Promise<Language> {
  const { data } = await api.post<{ language: Language }>('/catalogs/languages', payload)
  return data.language
}

export async function updateLanguage(
  id: number,
  payload: { name: string; isoCode: string },
): Promise<Language> {
  const { data } = await api.patch<{ language: Language }>(`/catalogs/languages/${id}`, payload)
  return data.language
}

export async function toggleLanguageActive(id: number): Promise<Language> {
  const { data } = await api.patch<{ language: Language }>(`/catalogs/languages/${id}/toggle-active`)
  return data.language
}

export async function fetchBodySystems(): Promise<BodySystem[]> {
  const { data } = await api.get<{ bodySystems: BodySystem[] }>('/catalogs/body-systems')
  return data.bodySystems
}

export async function createBodySystem(name: string): Promise<BodySystem> {
  const { data } = await api.post<{ bodySystem: BodySystem }>('/catalogs/body-systems', { name })
  return data.bodySystem
}

export async function updateBodySystem(id: number, name: string): Promise<BodySystem> {
  const { data } = await api.patch<{ bodySystem: BodySystem }>(`/catalogs/body-systems/${id}`, { name })
  return data.bodySystem
}

export async function toggleBodySystemActive(id: number): Promise<BodySystem> {
  const { data } = await api.patch<{ bodySystem: BodySystem }>(`/catalogs/body-systems/${id}/toggle-active`)
  return data.bodySystem
}

export async function fetchParaclinicalCategories(): Promise<
  ParaclinicalCategoryCatalog[]
> {
  const { data } = await api.get<{
    paraclinicalCategories: ParaclinicalCategoryCatalog[]
  }>('/catalogs/paraclinical-categories')
  return data.paraclinicalCategories
}

export async function createParaclinicalCategory(
  payload: CreateParaclinicalCategoryPayload,
): Promise<ParaclinicalCategoryCatalog> {
  const { data } = await api.post<{
    paraclinicalCategory: ParaclinicalCategoryCatalog
  }>('/catalogs/paraclinical-categories', payload)
  return data.paraclinicalCategory
}

export async function updateParaclinicalCategory(
  id: number,
  payload: UpdateParaclinicalCategoryPayload,
): Promise<ParaclinicalCategoryCatalog> {
  const { data } = await api.patch<{
    paraclinicalCategory: ParaclinicalCategoryCatalog
  }>(`/catalogs/paraclinical-categories/${id}`, payload)
  return data.paraclinicalCategory
}

export async function toggleParaclinicalCategoryActive(
  id: number,
): Promise<ParaclinicalCategoryCatalog> {
  const { data } = await api.patch<{
    paraclinicalCategory: ParaclinicalCategoryCatalog
  }>(`/catalogs/paraclinical-categories/${id}/toggle-active`)
  return data.paraclinicalCategory
}

export async function fetchMedicationPresentations(): Promise<MedicationPresentation[]> {
  const { data } = await api.get<{ medicationPresentations: MedicationPresentation[] }>(
    '/catalogs/medication-presentations',
  )
  return data.medicationPresentations
}

export async function createMedicationPresentation(name: string): Promise<MedicationPresentation> {
  const { data } = await api.post<{ medicationPresentation: MedicationPresentation }>(
    '/catalogs/medication-presentations',
    { name },
  )
  return data.medicationPresentation
}

export async function updateMedicationPresentation(id: number, name: string): Promise<MedicationPresentation> {
  const { data } = await api.patch<{ medicationPresentation: MedicationPresentation }>(
    `/catalogs/medication-presentations/${id}`,
    { name },
  )
  return data.medicationPresentation
}

export async function toggleMedicationPresentationActive(id: number): Promise<MedicationPresentation> {
  const { data } = await api.patch<{ medicationPresentation: MedicationPresentation }>(
    `/catalogs/medication-presentations/${id}/toggle-active`,
  )
  return data.medicationPresentation
}

export async function fetchMedicationCategories(): Promise<MedicationCategory[]> {
  const { data } = await api.get<{ medicationCategories: MedicationCategory[] }>(
    '/catalogs/medication-categories',
  )
  return data.medicationCategories
}

export async function createMedicationCategory(name: string): Promise<MedicationCategory> {
  const { data } = await api.post<{ medicationCategory: MedicationCategory }>(
    '/catalogs/medication-categories',
    { name },
  )
  return data.medicationCategory
}

export async function updateMedicationCategory(id: number, name: string): Promise<MedicationCategory> {
  const { data } = await api.patch<{ medicationCategory: MedicationCategory }>(
    `/catalogs/medication-categories/${id}`,
    { name },
  )
  return data.medicationCategory
}

export async function toggleMedicationCategoryActive(id: number): Promise<MedicationCategory> {
  const { data } = await api.patch<{ medicationCategory: MedicationCategory }>(
    `/catalogs/medication-categories/${id}/toggle-active`,
  )
  return data.medicationCategory
}

export async function fetchMedicalSpecialties(): Promise<MedicalSpecialty[]> {
  const { data } = await api.get<{ medicalSpecialties: MedicalSpecialty[] }>('/catalogs/medical-specialties')
  return data.medicalSpecialties
}

export async function createMedicalSpecialty(name: string): Promise<MedicalSpecialty> {
  const { data } = await api.post<{ medicalSpecialty: MedicalSpecialty }>('/catalogs/medical-specialties', {
    name,
  })
  return data.medicalSpecialty
}

export async function updateMedicalSpecialty(id: number, name: string): Promise<MedicalSpecialty> {
  const { data } = await api.patch<{ medicalSpecialty: MedicalSpecialty }>(
    `/catalogs/medical-specialties/${id}`,
    { name },
  )
  return data.medicalSpecialty
}

export async function toggleMedicalSpecialtyActive(id: number): Promise<MedicalSpecialty> {
  const { data } = await api.patch<{ medicalSpecialty: MedicalSpecialty }>(
    `/catalogs/medical-specialties/${id}/toggle-active`,
  )
  return data.medicalSpecialty
}

// ─── Tipos de alergia ───────────────────────────────────────────────────────

export async function fetchAllergyTypes(): Promise<AllergyType[]> {
  const { data } = await api.get<{ allergyTypes: AllergyType[] }>('/catalogs/allergy-types')
  return data.allergyTypes
}

export async function createAllergyType(name: string): Promise<AllergyType> {
  const { data } = await api.post<{ allergyType: AllergyType }>('/catalogs/allergy-types', { name })
  return data.allergyType
}

export async function updateAllergyType(id: number, name: string): Promise<AllergyType> {
  const { data } = await api.patch<{ allergyType: AllergyType }>(`/catalogs/allergy-types/${id}`, { name })
  return data.allergyType
}

export async function toggleAllergyTypeActive(id: number): Promise<AllergyType> {
  const { data } = await api.patch<{ allergyType: AllergyType }>(
    `/catalogs/allergy-types/${id}/toggle-active`,
  )
  return data.allergyType
}

// ─── Severidad de alergia ───────────────────────────────────────────────────

export async function fetchAllergySeverities(): Promise<AllergySeverity[]> {
  const { data } = await api.get<{ allergySeverities: AllergySeverity[] }>(
    '/catalogs/allergy-severities',
  )
  return data.allergySeverities
}

export async function createAllergySeverity(name: string): Promise<AllergySeverity> {
  const { data } = await api.post<{ allergySeverity: AllergySeverity }>(
    '/catalogs/allergy-severities',
    { name },
  )
  return data.allergySeverity
}

export async function updateAllergySeverity(id: number, name: string): Promise<AllergySeverity> {
  const { data } = await api.patch<{ allergySeverity: AllergySeverity }>(
    `/catalogs/allergy-severities/${id}`,
    { name },
  )
  return data.allergySeverity
}

export async function toggleAllergySeverityActive(id: number): Promise<AllergySeverity> {
  const { data } = await api.patch<{ allergySeverity: AllergySeverity }>(
    `/catalogs/allergy-severities/${id}/toggle-active`,
  )
  return data.allergySeverity
}

// ─── Severidad de síntomas ──────────────────────────────────────────────────

export async function fetchSymptomSeverities(): Promise<SymptomSeverity[]> {
  const { data } = await api.get<{ symptomSeverities: SymptomSeverity[] }>(
    '/catalogs/symptom-severities',
  )
  return data.symptomSeverities
}

export async function createSymptomSeverity(name: string): Promise<SymptomSeverity> {
  const { data } = await api.post<{ symptomSeverity: SymptomSeverity }>(
    '/catalogs/symptom-severities',
    { name },
  )
  return data.symptomSeverity
}

export async function updateSymptomSeverity(id: number, name: string): Promise<SymptomSeverity> {
  const { data } = await api.patch<{ symptomSeverity: SymptomSeverity }>(
    `/catalogs/symptom-severities/${id}`,
    { name },
  )
  return data.symptomSeverity
}

export async function toggleSymptomSeverityActive(id: number): Promise<SymptomSeverity> {
  const { data } = await api.patch<{ symptomSeverity: SymptomSeverity }>(
    `/catalogs/symptom-severities/${id}/toggle-active`,
  )
  return data.symptomSeverity
}

// ─── Alergias (catálogo) ────────────────────────────────────────────────────

export async function fetchAllergyCatalog(): Promise<AllergyCatalog[]> {
  const { data } = await api.get<{ allergies: AllergyCatalog[] }>('/catalogs/allergies')
  return data.allergies
}

export async function createAllergyCatalog(
  payload: CreateAllergyCatalogPayload,
): Promise<AllergyCatalog> {
  const { data } = await api.post<{ allergy: AllergyCatalog }>('/catalogs/allergies', payload)
  return data.allergy
}

export async function updateAllergyCatalog(
  id: number,
  payload: UpdateAllergyCatalogPayload,
): Promise<AllergyCatalog> {
  const { data } = await api.patch<{ allergy: AllergyCatalog }>(`/catalogs/allergies/${id}`, payload)
  return data.allergy
}

export async function toggleAllergyCatalogActive(id: number): Promise<AllergyCatalog> {
  const { data } = await api.patch<{ allergy: AllergyCatalog }>(
    `/catalogs/allergies/${id}/toggle-active`,
  )
  return data.allergy
}

// ─── Enfermedades (catálogo) ────────────────────────────────────────────────

export async function fetchDiseases(): Promise<Disease[]> {
  const { data } = await api.get<{ diseases: Disease[] }>('/catalogs/diseases')
  return data.diseases
}

export async function createDisease(payload: CreateDiseasePayload): Promise<Disease> {
  const { data } = await api.post<{ disease: Disease }>('/catalogs/diseases', payload)
  return data.disease
}

export async function updateDisease(
  id: number,
  payload: UpdateDiseasePayload,
): Promise<Disease> {
  const { data } = await api.patch<{ disease: Disease }>(`/catalogs/diseases/${id}`, payload)
  return data.disease
}

export async function toggleDiseaseActive(id: number): Promise<Disease> {
  const { data } = await api.patch<{ disease: Disease }>(`/catalogs/diseases/${id}/toggle-active`)
  return data.disease
}

// ─── Antecedentes familiares (catálogo) ─────────────────────────────────────

export async function fetchAntecedentFamilyCatalog(): Promise<AntecedentFamilyCatalog[]> {
  const { data } = await api.get<{ antecedentFamily: AntecedentFamilyCatalog[] }>(
    '/catalogs/antecedent-family',
  )
  return data.antecedentFamily
}

export async function createAntecedentFamily(name: string): Promise<AntecedentFamilyCatalog> {
  const { data } = await api.post<{ antecedentFamily: AntecedentFamilyCatalog }>(
    '/catalogs/antecedent-family',
    { name },
  )
  return data.antecedentFamily
}

export async function updateAntecedentFamily(id: number, name: string): Promise<AntecedentFamilyCatalog> {
  const { data } = await api.patch<{ antecedentFamily: AntecedentFamilyCatalog }>(
    `/catalogs/antecedent-family/${id}`,
    { name },
  )
  return data.antecedentFamily
}

export async function toggleAntecedentFamilyActive(id: number): Promise<AntecedentFamilyCatalog> {
  const { data } = await api.patch<{ antecedentFamily: AntecedentFamilyCatalog }>(
    `/catalogs/antecedent-family/${id}/toggle-active`,
  )
  return data.antecedentFamily
}

// ─── Antecedentes personales (catálogo) ─────────────────────────────────────

export async function fetchAntecedentPersonalCatalog(): Promise<AntecedentPersonalCatalog[]> {
  const { data } = await api.get<{ antecedentPersonal: AntecedentPersonalCatalog[] }>(
    '/catalogs/antecedent-personal',
  )
  return data.antecedentPersonal
}

export async function createAntecedentPersonal(name: string): Promise<AntecedentPersonalCatalog> {
  const { data } = await api.post<{ antecedentPersonal: AntecedentPersonalCatalog }>(
    '/catalogs/antecedent-personal',
    { name },
  )
  return data.antecedentPersonal
}

export async function updateAntecedentPersonal(
  id: number,
  name: string,
): Promise<AntecedentPersonalCatalog> {
  const { data } = await api.patch<{ antecedentPersonal: AntecedentPersonalCatalog }>(
    `/catalogs/antecedent-personal/${id}`,
    { name },
  )
  return data.antecedentPersonal
}

export async function toggleAntecedentPersonalActive(id: number): Promise<AntecedentPersonalCatalog> {
  const { data } = await api.patch<{ antecedentPersonal: AntecedentPersonalCatalog }>(
    `/catalogs/antecedent-personal/${id}/toggle-active`,
  )
  return data.antecedentPersonal
}

// ─── Cirugías (catálogo) ─────────────────────────────────────────────────────

export async function fetchSurgeryCatalog(): Promise<SurgeryCatalog[]> {
  const { data } = await api.get<{ surgeries: SurgeryCatalog[] }>('/catalogs/surgeries')
  return data.surgeries
}

export async function createSurgery(name: string): Promise<SurgeryCatalog> {
  const { data } = await api.post<{ surgery: SurgeryCatalog }>('/catalogs/surgeries', { name })
  return data.surgery
}

export async function updateSurgery(id: number, name: string): Promise<SurgeryCatalog> {
  const { data } = await api.patch<{ surgery: SurgeryCatalog }>(`/catalogs/surgeries/${id}`, { name })
  return data.surgery
}

export async function toggleSurgeryActive(id: number): Promise<SurgeryCatalog> {
  const { data } = await api.patch<{ surgery: SurgeryCatalog }>(`/catalogs/surgeries/${id}/toggle-active`)
  return data.surgery
}

// ─── Hospitalizaciones (catálogo) ───────────────────────────────────────────

export async function fetchHospitalizationCatalog(): Promise<HospitalizationCatalog[]> {
  const { data } = await api.get<{ hospitalizationReasons: HospitalizationCatalog[] }>(
    '/catalogs/hospitalization-reasons',
  )
  return data.hospitalizationReasons
}

export async function createHospitalization(name: string): Promise<HospitalizationCatalog> {
  const { data } = await api.post<{ hospitalizationReason: HospitalizationCatalog }>(
    '/catalogs/hospitalization-reasons',
    { name },
  )
  return data.hospitalizationReason
}

export async function updateHospitalization(id: number, name: string): Promise<HospitalizationCatalog> {
  const { data } = await api.patch<{ hospitalizationReason: HospitalizationCatalog }>(
    `/catalogs/hospitalization-reasons/${id}`,
    { name },
  )
  return data.hospitalizationReason
}

export async function toggleHospitalizationActive(id: number): Promise<HospitalizationCatalog> {
  const { data } = await api.patch<{ hospitalizationReason: HospitalizationCatalog }>(
    `/catalogs/hospitalization-reasons/${id}/toggle-active`,
  )
  return data.hospitalizationReason
}
