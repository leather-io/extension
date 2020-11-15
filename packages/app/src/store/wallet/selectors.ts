import { AppState } from '..';
import { defaultNetworks, defaultNetworkKey } from './reducer';

export const selectCurrentWallet = (state: AppState) => state.wallet.currentWallet;
export const selectIdentities = (state: AppState) => state.wallet.identities;
export const selectFirstIdentity = (state: AppState) => state.wallet.currentWallet?.identities[0];
export const selectIsSignedIn = (state: AppState) => state.wallet.identities?.length > 1;
export const selectIsRestoringWallet = (state: AppState) => state.wallet.isRestoringWallet;
export const selectCurrentIdentityIndex = (state: AppState) =>
  state.wallet.currentIdentityIndex || 0;

export const selectCurrentIdentity = (state: AppState) => {
  const identities = selectIdentities(state);
  const identityIndex = selectCurrentIdentityIndex(state);
  const identity = identities[identityIndex];
  return identity;
};

export const selectNetworks = (state: AppState) => state.wallet.networks || defaultNetworks;
export const selectCurrentNetworkKey = (state: AppState) =>
  state.wallet.currentNetwork || defaultNetworkKey;
export const selectCurrentNetwork = (state: AppState) => {
  const networks = selectNetworks(state);
  return networks[selectCurrentNetworkKey(state)];
};
