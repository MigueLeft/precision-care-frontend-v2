import { defaultCountries, parseCountry, type CountryData } from 'react-international-phone'

// Países más usados por los pacientes: arriba del selector.
const PREFERRED = ['ve', 'mx', 'ar', 'es', 'us']

// Solo América y Europa (sin Asia, África ni Oceanía).
const AMERICAS = [
  'ag', 'ar', 'aw', 'bs', 'bb', 'bz', 'bo', 'br', 'ca', 'bq', 'ky', 'cl', 'co', 'cr', 'cu', 'cw',
  'dm', 'do', 'ec', 'sv', 'gf', 'gl', 'gd', 'gp', 'gt', 'gy', 'ht', 'hn', 'jm', 'mq', 'mx', 'ni',
  'pa', 'py', 'pe', 'pr', 'kn', 'lc', 'pm', 'vc', 'sr', 'tt', 'us', 'uy', 've',
]
const EUROPE = [
  'al', 'ad', 'at', 'by', 'be', 'ba', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fo', 'fi', 'fr', 'de',
  'gi', 'gr', 'hu', 'is', 'ie', 'it', 'xk', 'lv', 'li', 'lt', 'lu', 'mk', 'mt', 'md', 'mc', 'me',
  'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sm', 'rs', 'sk', 'si', 'es', 'se', 'ch', 'ua', 'gb', 'va',
]
const ALLOWED = new Set([...AMERICAS, ...EUROPE])

const iso2Of = (country: CountryData) => parseCountry(country).iso2
const nameOf = (country: CountryData) => parseCountry(country).name

// Preferidos primero (en ese orden) y el resto por nombre.
export const PHONE_COUNTRIES: CountryData[] = [
  ...PREFERRED.map((iso2) => defaultCountries.find((country) => iso2Of(country) === iso2)).filter(
    (country): country is CountryData => !!country,
  ),
  ...defaultCountries
    .filter((country) => ALLOWED.has(iso2Of(country)) && !PREFERRED.includes(iso2Of(country)))
    .sort((a, b) => nameOf(a).localeCompare(nameOf(b), 'es')),
]

export const PREFERRED_PHONE_COUNTRIES = PREFERRED.length
