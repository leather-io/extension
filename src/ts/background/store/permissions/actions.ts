import { PermissionsActions, AUTH_REQUEST } from './types'

export const doAuthRequest = (authRequest: string): PermissionsActions => {
  return {
    type: AUTH_REQUEST,
    authRequest
  }
}