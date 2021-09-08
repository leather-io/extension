import { abbreviateNumber } from '@common/utils';

export type SIP010TransferResponse = { okay: true; hasMemo: boolean } | { error: string };

export function removeCommas(amountWithCommas: string) {
  return amountWithCommas.replace(/,/g, '');
}

export function getFormattedAmount(amount: string) {
  const noCommas = removeCommas(amount);
  const number = noCommas.includes('.') ? parseFloat(noCommas) : parseInt(noCommas);
  return number > 10000
    ? {
        isAbbreviated: true,
        value: abbreviateNumber(number),
      }
    : { value: amount, isAbbreviated: false };
}
