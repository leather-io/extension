import { BtcKitMethodMap, ExtractErrorResponse, ExtractSuccessResponse } from '@btckit/types';

import type { ValueOf } from '@leather.io/models';

import { SignStacksTransaction } from '@shared/rpc/methods/sign-stacks-transaction';

import { Open } from './methods/open';
import { SignPsbt } from './methods/sign-psbt';
import { SignStacksMessage } from './methods/sign-stacks-message';
import { SupportedMethods } from './methods/supported-methods';
import { Swap } from './methods/swap';

// Supports BtcKit methods, as well as custom Leather methods
export type WalletMethodMap = BtcKitMethodMap &
  Open &
  Swap &
  SupportedMethods &
  SignPsbt &
  SignStacksTransaction &
  SignStacksMessage;

export type WalletRequests = ValueOf<WalletMethodMap>['request'];
export type WalletResponses = ValueOf<WalletMethodMap>['response'];

export type WalletMethodNames = keyof WalletMethodMap;

export function makeRpcSuccessResponse<T extends WalletMethodNames>(
  _method: T,
  response: Omit<ExtractSuccessResponse<WalletMethodMap[T]['response']>, 'jsonrpc'>
): WalletMethodMap[T]['response'] {
  // typecasting as there's a error stating jsonrpc prop is already there
  return { jsonrpc: '2.0', ...response } as WalletMethodMap[T]['response'];
}

export function makeRpcErrorResponse<T extends WalletMethodNames>(
  _method: T,
  response: Omit<ExtractErrorResponse<WalletMethodMap[T]['response']>, 'jsonrpc'>
) {
  return { jsonrpc: '2.0', ...response } as WalletMethodMap[T]['response'];
}
