import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { PsbtBase, PsbtPayload } from '@stacks/connect';

import { Prettify } from '@shared/utils/type-utils';

type SignPsbtRequest = RpcRequest<'signPsbt', Prettify<Omit<PsbtPayload, keyof PsbtBase>>>;

type SignPsbtResponse = RpcResponse<{ hex: string }>;

export type SignPsbt = DefineRpcMethod<SignPsbtRequest, SignPsbtResponse>;
