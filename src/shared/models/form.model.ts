import type { Inscription, Money } from '@leather.io/models';

export interface BitcoinSendFormValues {
  amount: number | string;
  fee: number | string;
  feeCurrency: string;
  feeType: string;
  memo: string;
  recipient: string;
  recipientBnsName: string;
  symbol: string;
}

export interface OrdinalSendFormValues {
  feeRate: number;
  recipient: string;
  inscription: Inscription;
}

// TODO: Remove assetId and optional symbol with legacy send form
export interface StacksSendFormValues {
  amount: number | string;
  assetId?: string;
  fee: number | string;
  feeCurrency: string;
  feeType: string;
  memo: string;
  nonce?: number | string;
  recipient: string;
  recipientBnsName: string;
  symbol?: string;
}

export interface StacksTransactionFormValues {
  fee: number | string;
  feeCurrency: string;
  feeType: string;
  nonce?: number | string;
}

export interface TransferRecipient {
  address: string;
  amount: Money;
}
