import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import * as yup from 'yup';

const rpcOpenParamsSchema = yup.object().shape({
  url: yup.string(),
});

type OpenRequestParams = yup.InferType<typeof rpcOpenParamsSchema>;

export type OpenRequest = RpcRequest<'open', OpenRequestParams>;

type OpenResponse = RpcResponse<Response>;

export type Open = DefineRpcMethod<OpenRequest, OpenResponse>;
