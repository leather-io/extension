import { BtcKitMethodMap, ExtractErrorResponse, ExtractSuccessResponse } from '@btckit/types';

import { ValueOf } from '@shared/utils/type-utils';

import { SupportedMethods } from './methods/supported-methods';
import { Test } from './methods/test-method';

// Supports BtcKit methods, as well as custom Hiro Wallet methods
export type WalletMethodMap = BtcKitMethodMap & Test & SupportedMethods;

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
