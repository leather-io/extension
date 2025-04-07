import type { BitcoinNetworkModes } from '@leather.io/models';

export interface AppPermission {
  origin: string;
  // Very simple permission system. If property exists with date, user
  // has given permission
  requestedAccounts?: string;
  accountIndex: number;
  networkMode: BitcoinNetworkModes;
}

export function hasRequestedAccountPermission(permission?: AppPermission) {
  return !!permission?.requestedAccounts;
}
