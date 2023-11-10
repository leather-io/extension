function truncateHex(hex: string, offset = 5): string {
  return `${hex.substring(0, offset + 2)}…${hex.substring(hex.length - offset)}`;
}

export function truncateMiddle(input: string, offset = 5): string {
  if (!input) return '';
  // Hex
  if (input.startsWith('0x')) {
    return truncateHex(input, offset);
  }
  // For contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substring(0, offset);
    const end = parts[0]?.substring(parts[0].length - offset, parts[0].length);
    return `${start}…${end}.${parts[1]}`;
  } else {
    // Everything else
    const start = input?.substring(0, offset);
    const end = input?.substring(input.length - offset, input.length);
    return `${start}…${end}`;
  }
}
