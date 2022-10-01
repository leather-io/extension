export interface SendFormValues {
  assetId: string;
  amount: number | string;
  fee: number | string;
  feeType: string;
  recipient: string;
  memo: string;
  nonce?: number | string;
}

export interface TransactionFormValues {
  fee: number | string;
  feeType: string;
  nonce?: number | string;
}
