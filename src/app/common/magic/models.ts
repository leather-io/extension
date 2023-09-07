export interface MagicSupplier {
  controller: string;
  inboundFee: number;
  outboundFee: number;
  outboundBaseFee: number;
  inboundBaseFee: number;
  publicKey: string;
  funds: number;
  id: number;
}

export type MagicSupplierWithCapacity = MagicSupplier & { btc: string; btcAddress: string };

export enum MagicInboundSwapStatus {
  CREATED = 'created',
  FUNDS_CONFIRMING = 'funds-confirming',
  FUNDS_CONFIRMED = 'funds-confirmed',
  FUNDS_CONFIRM_FAILED = 'funds-confirm-failed',
  FUNDS_FINALIZING = 'funds-finalizing',
  FUNDS_FINALIZED = 'funds-finalized',
  FUNDS_FINALIZE_FAILED = 'funds-finalize-failed',
}

export interface MagicInboundSwap {
  id: string;
  secret: string;
  amount: string;
  createdAt: number;
  publicKey: string;
  expiration: number;
  supplier: MagicSupplier;
  escrowTransactionId?: string;
  swapperId: number | undefined;
  status: MagicInboundSwapStatus;
  recoveryTransactionId?: string;
  finalizeTransactionStatus?: string;
}

export interface MagicOutboundSwap {
  test: string;
}

export type MagicSwap =
  | ({ direction: 'inbound' } & MagicInboundSwap)
  | ({ direction: 'outbound' } & MagicInboundSwap);
