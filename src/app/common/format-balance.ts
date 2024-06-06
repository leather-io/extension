import { abbreviateNumber } from './utils';

function removeCommas(amountWithCommas: string) {
  return amountWithCommas.replace(/,/g, '');
}

export function formatBalance(amount: string) {
  const noCommas = removeCommas(amount);
  const number = noCommas.includes('.') ? parseFloat(noCommas) : parseInt(noCommas);
  return number > 10000
    ? {
        isAbbreviated: true,
        value: abbreviateNumber(number),
      }
    : { isAbbreviated: false, value: amount };
}
