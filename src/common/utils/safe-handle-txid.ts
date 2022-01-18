export function safelyFormatHexTxid(id: string) {
  const prefix = '0x';
  if (id.startsWith(prefix)) return id;
  return prefix + id;
}
