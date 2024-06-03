import { truncateMiddle } from '@leather-wallet/utils';

export function formatAccountName(input: string, maxLength = 20, offset = 4) {
  if (input.length > maxLength) {
    return truncateMiddle(input, offset);
  }
  return input;
}
