import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';

export interface SwapRequestParams {
  from?: string;
  to?: string;
}

export type SwapRequest = RpcRequest<'swap', SwapRequestParams>;

type SwapResponse = RpcResponse<{ message: string }>;

export type Swap = DefineRpcMethod<SwapRequest, SwapResponse>;
