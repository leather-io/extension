import { DefineRpcMethod, RpcRequest, RpcSuccessResponse } from '@btckit/types';

// Demo method used to serve as example while we only have a single method
type TestRequest = RpcRequest<'demoMethodDeleteWhenAddingMore'>;

type TestResponse = RpcSuccessResponse<{ testResponse: string }>;

export type Test = DefineRpcMethod<TestRequest, TestResponse>;
