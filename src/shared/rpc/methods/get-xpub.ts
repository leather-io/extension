import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';

export type GetXpubRequest = RpcRequest<'getXpub'>;

type GetXpubResponse = RpcResponse<{ xpubs: [] }>;

export type GetXpub = DefineRpcMethod<GetXpubRequest, GetXpubResponse>;
