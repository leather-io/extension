export interface SendFormValues {
  amount: number | string;
  assetId: string;
  fee: number | string;
  feeType: string;
  recipient: string;
  recipientAddressOrBnsName: string;
  memo: string;
  nonce?: number | string;
}

export interface TransactionFormValues {
  fee: number | string;
  feeType: string;
  nonce?: number | string;
}
