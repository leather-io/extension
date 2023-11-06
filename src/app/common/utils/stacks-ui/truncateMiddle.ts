/**
 * truncateHex
 *
 * Truncates hex while keeping the 0x prefix.
 *
 * @param {string} hex - the hex to truncate
 * @param {number} offset - the number of chars to keep
 */
function truncateHex(hex: string, offset = 5): string {
  return `${hex.substring(0, offset + 2)}…${hex.substring(hex.length - offset)}`;
}

/**
 * truncateMiddle
 *
 * If contract_id, it will truncate the principal, while keeping the contract name untouched.
 * If prefixed with '0x', will truncate everything after prefix.
 *
 * @param {string} input - the string to truncate
 * @param {number} offset - the number of chars to keep on either end
 */
export function truncateMiddle(input: string, offset = 5): string {
  if (!input) return '';
  // hex
  if (input.startsWith('0x')) {
    return truncateHex(input, offset);
  }
  // for contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substr(0, offset);
    const end = parts[0]?.substr(parts[0].length - offset, parts[0].length);
    return `${start}…${end}.${parts[1]}`;
  } else {
    // everything else
    const start = input?.substr(0, offset);
    const end = input?.substr(input.length - offset, input.length);
    return `${start}…${end}`;
  }
}
