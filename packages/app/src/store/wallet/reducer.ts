import { Reducer } from 'redux';
import {
  WalletActions,
  WalletState,
  RESTORE_WALLET,
  IS_RESTORING_WALLET,
  GENERATE_WALLET,
  ADD_NETWORK,
  CHANGE_NETWORK,
  SIGN_OUT,
  SET_IDENTITY_INDEX,
} from './types';

export const defaultNetworks = {
  mainnet: {
    url: 'https://core.blockstack.org',
    name: 'Mainnet',
  },
  testnet: {
    url: 'https://stacks-node-api.blockstack.org',
    name: 'Testnet',
  },
  localnet: {
    url: 'http://localhost:3999',
    name: 'Localnet',
  },
};

export const defaultNetworkKey = 'testnet';

const initialState: WalletState = {
  secretKey: undefined,
  isRestoringWallet: false,
  currentWallet: undefined,
  identities: [],
  currentIdentityIndex: 0,
  networks: defaultNetworks,
  currentNetwork: defaultNetworkKey,
};

export const walletReducer: Reducer<WalletState, WalletActions> = (
  state = initialState,
  action: WalletActions
): WalletState => {
  switch (action.type) {
    case RESTORE_WALLET:
      return {
        ...state,
        currentWallet: action.payload,
        identities: [...action.payload.identities],
        isRestoringWallet: false,
      };
    case IS_RESTORING_WALLET:
      return {
        ...state,
        isRestoringWallet: true,
      };
    case GENERATE_WALLET:
      return {
        ...state,
        currentWallet: action.payload,
        identities: [...action.payload.identities],
      };
    case SIGN_OUT:
      return {
        ...state,
        ...initialState,
      };
    case ADD_NETWORK:
      const { url, name, key } = action;
      const networks = state.networks || defaultNetworks;
      networks[key] = {
        url,
        name,
      };
      return {
        ...state,
        networks,
        currentNetwork: key,
      };
    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.key,
      };
    case SET_IDENTITY_INDEX:
      return {
        ...state,
        currentIdentityIndex: action.index,
      };
    default:
      return state;
  }
};
