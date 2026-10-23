export interface LoginCredentials {
  email: string
  password: string
}

export interface ChangePasswordValues {
  currentPassword: string
  newPassword: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}
