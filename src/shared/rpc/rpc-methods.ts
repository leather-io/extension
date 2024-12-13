import type { ValueOf } from '@leather.io/models';
import {
  type ExtractErrorResponse,
  type ExtractSuccessResponse,
  type LeatherRpcMethodMap,
} from '@leather.io/rpc';

export type WalletRequests = ValueOf<LeatherRpcMethodMap>['request'];
export type WalletResponses = ValueOf<LeatherRpcMethodMap>['response'];

export type WalletMethodNames = keyof LeatherRpcMethodMap;

export function makeRpcSuccessResponse<T extends WalletMethodNames>(
  _method: T,
  response: Omit<ExtractSuccessResponse<LeatherRpcMethodMap[T]['response']>, 'jsonrpc'>
): LeatherRpcMethodMap[T]['response'] {
  // typecasting as there's a error stating jsonrpc prop is already there
  return { jsonrpc: '2.0', ...response } as LeatherRpcMethodMap[T]['response'];
}

export function makeRpcErrorResponse<T extends WalletMethodNames>(
  _method: T,
  response: Omit<ExtractErrorResponse<LeatherRpcMethodMap[T]['response']>, 'jsonrpc'>
) {
  return { jsonrpc: '2.0', ...response } as LeatherRpcMethodMap[T]['response'];
}
