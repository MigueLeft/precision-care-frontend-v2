export const identityKeys = {
  users: ['identity', 'users'] as const,
  userDetail: (id: number) => ['identity', 'users', id] as const,
  roles: ['identity', 'roles'] as const,
  roleDetail: (id: number) => ['identity', 'roles', id] as const,
  permissions: ['identity', 'permissions'] as const,
  specialistsLookup: ['identity', 'specialists-lookup'] as const,
}
