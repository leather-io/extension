import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { AllowAdditionaProperties } from '@btckit/types/dist/types/utils';

export interface BitcoinContractResponseParams extends AllowAdditionaProperties {
  bitcoinContractOffer: string;
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

export interface BitcoinContractResponseBody extends AllowAdditionaProperties {
  contractId: string;
  action: string;
  txId?: string;
  error?: string;
}

export type BitcoinContractRequest = RpcRequest<
  'acceptBitcoinContractOffer',
  BitcoinContractResponseParams
>;
export type BitcoinContractResponse = RpcResponse<BitcoinContractResponseBody>;
export type AcceptBitcoinContract = DefineRpcMethod<
  BitcoinContractRequest,
  BitcoinContractResponse
>;
