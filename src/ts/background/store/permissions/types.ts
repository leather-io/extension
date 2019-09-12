export const AUTH_REQUEST = 'PERMISSIONS/AUTH_REQUEST'

export interface AuthRequestAction {
  type: typeof AUTH_REQUEST,
  authRequest: string
}

export interface PermissionsState {
  authRequest: string | null,
  decodedAuthRequest: string | null
}

export type PermissionsActions = AuthRequestAction