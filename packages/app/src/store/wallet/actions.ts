import { ThunkAction } from 'redux-thunk';
import { Wallet } from '@stacks/keychain';
import {
  WalletActions,
  RESTORE_WALLET,
  IS_RESTORING_WALLET,
  GENERATE_WALLET,
  SIGN_OUT,
  ADD_NETWORK,
  CHANGE_NETWORK,
  Network,
  SET_IDENTITY_INDEX,
} from './types';
import { ChainID } from '@blockstack/stacks-transactions';

export function didRestoreWallet(wallet: Wallet): WalletActions {
  return {
    type: RESTORE_WALLET,
    payload: wallet,
  };
}

export function didGenerateWallet(wallet: Wallet): WalletActions {
  return {
    type: GENERATE_WALLET,
    payload: wallet,
  };
}

function isRestoringWallet(): WalletActions {
  return {
    type: IS_RESTORING_WALLET,
  };
}

export function doSignOut(): WalletActions {
  return {
    type: SIGN_OUT,
  };
}

export function doAddNetwork(network: Network): WalletActions {
  return {
    type: ADD_NETWORK,
    ...network,
  };
}

export function doChangeNetwork(key: string): WalletActions {
  return {
    type: CHANGE_NETWORK,
    key,
  };
}

export function doSetIdentityIndex(index: number): WalletActions {
  return {
    type: SET_IDENTITY_INDEX,
    index,
  };
}

export function doStoreSeed(
  secretKey: string,
  password: string
): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.restore(password, secretKey, ChainID.Mainnet);
    dispatch(didRestoreWallet(wallet));
    return wallet;
  };
}

export function doGenerateWallet(
  password: string
): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.generate(password, ChainID.Mainnet);
    dispatch(didGenerateWallet(wallet));
    return wallet;
  };
}
