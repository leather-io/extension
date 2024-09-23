/**
 * Encode `text` to a hex string. Accepts text with any characters (like emojis).
 * Does not match ASCII codes for latin-script letters (ie: "a" will not be encoded to "61").
 * @param text string to encode
 */
export function encodeText(text: string) {
  return Array.from(new TextEncoder().encode(btoa(encodeURIComponent(text))))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decode `hex` previously encoded with [encodeText]{@link encodeText} to the original text.
 * @param hex string to decode
 */
export function decodeText(hex?: string) {
  if (!hex) return '';
  const bytes = new Uint8Array((hex.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16)));
  return decodeURIComponent(atob(new TextDecoder().decode(bytes)));
}
