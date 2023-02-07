export interface BitcoinSendFormValues {
  amount: number | string;
  fee: number | string;
  feeType: string;
  memo: string;
  recipient: string;
  symbol: string;
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
  recipientAddressOrBnsName: string;
  symbol?: string;
  isMemoRequired: false;
}

export interface StacksTransactionFormValues {
  fee: number | string;
  feeType: string;
  nonce?: number | string;
}
