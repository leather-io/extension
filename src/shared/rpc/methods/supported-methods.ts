import { DefineRpcMethod, RpcRequest, RpcSuccessResponse } from '@btckit/types';

// Demo method used to serve as example while we only have a single method
type SupportedMethodsRequest = RpcRequest<'supportedMethods'>;

type SupportedMethodsResponse = RpcSuccessResponse<{
  documentation: string;
  methods: { name: string; docsUrl?: string | string[] }[];
}>;

export type SupportedMethods = DefineRpcMethod<SupportedMethodsRequest, SupportedMethodsResponse>;
