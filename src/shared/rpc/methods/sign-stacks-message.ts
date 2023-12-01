import * as yup from 'yup';

const rpcSignStacksMessageParamsSchema = yup.object().shape({
  stxAddress: yup.string(),
  txHex: yup.string().required(),
  attachment: yup.string(),
});

// export function validateRpcSignStacksTransactionParams(obj: unknown) {
//   return validateRpcParams(obj, rpcSignStacksTransactionParamsSchema);
// }

// export function getRpcSignStacksTransactionParamErrors(obj: unknown) {
//   return formatValidationErrors(getRpcParamErrors(obj, rpcSignStacksTransactionParamsSchema));
// }

// type SignStacksTransactionRequestParams = yup.InferType<
//   typeof rpcSignStacksTransactionParamsSchema
// >;

// export type SignStacksTransactionRequest = RpcRequest<
//   'stx_signTransaction',
//   SignStacksTransactionRequestParams
// >;

// type SignStacksTransactionResponse = RpcResponse<{ txHex: string }>;

// export type SignStacksTransaction = DefineRpcMethod<
//   SignStacksTransactionRequest,
//   SignStacksTransactionResponse
// >;
