import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';

export type OpenRequest = RpcRequest<'open'>;

type OpenResponse = RpcResponse<{ message: string }>;

export type Open = DefineRpcMethod<OpenRequest, OpenResponse>;
