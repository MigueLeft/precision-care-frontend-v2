import type { UserAccount } from '../types'

export function filterUsers(users: UserAccount[], q: string | undefined): UserAccount[] {
  if (!q) return users
  const needle = q.trim().toLowerCase()
  return users.filter((user) => `${user.name} ${user.lastName} ${user.email}`.toLowerCase().includes(needle))
}
