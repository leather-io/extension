import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { SignatureHash } from '@scure/btc-signer';

import { NetworkModes } from '@shared/constants';

interface SignPsbtRequestParams {
  publicKey: string;
  allowedSighash?: SignatureHash[];
  hex: string;
  signAtIndex?: number | number[];
  network?: NetworkModes;
}
export type SignPsbtRequest = RpcRequest<'signPsbt', SignPsbtRequestParams>;

type SignPsbtResponse = RpcResponse<{ hex: string }>;

export type SignPsbt = DefineRpcMethod<SignPsbtRequest, SignPsbtResponse>;
