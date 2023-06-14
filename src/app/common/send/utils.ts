export function formFeeRowValue(feeRate: number, isCustomFee?: boolean) {
  return `${isCustomFee ? '(Custom) ' : ''}${feeRate} sats/vB`;
}
