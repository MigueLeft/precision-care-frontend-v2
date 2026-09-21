// Edad en años cumplidos a `today` para una fecha YYYY-MM-DD. Devuelve null
// si la fecha es inválida o futura.
export function calculateAge(birthDate: string, today: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate)
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number)

  let age = today.getFullYear() - year
  const hadBirthday =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  if (!hadBirthday) age--

  return age >= 0 && age <= 150 ? age : null
}
