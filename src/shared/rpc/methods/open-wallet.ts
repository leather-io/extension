import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import * as yup from 'yup';

const rpcOpenWalletParamsSchema = yup.object().shape({
  url: yup.string(),
});

type OpenWalletRequestParams = yup.InferType<typeof rpcOpenWalletParamsSchema>;

export type OpenWalletRequest = RpcRequest<'openWallet', OpenWalletRequestParams>;

type OpenWalletResponse = RpcResponse<Response>;

export type OpenWallet = DefineRpcMethod<OpenWalletRequest, OpenWalletResponse>;
