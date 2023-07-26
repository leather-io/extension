import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { AllowAdditionalProperties } from '@btckit/types/dist/types/utils';

interface BitcoinContractResponseParams extends AllowAdditionalProperties {
  bitcoinContractOffer: string;
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

interface BitcoinContractResponseBody extends AllowAdditionalProperties {
  contractId: string;
  action: string;
  txId?: string;
  error?: string;
}

export type BitcoinContractRequest = RpcRequest<
  'acceptBitcoinContractOffer',
  BitcoinContractResponseParams
>;
type BitcoinContractResponse = RpcResponse<BitcoinContractResponseBody>;
export type AcceptBitcoinContract = DefineRpcMethod<
  BitcoinContractRequest,
  BitcoinContractResponse
>;
