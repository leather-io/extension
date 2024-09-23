import { decodeText, encodeText } from './text-encoding';

describe('encode and decode text', () => {
  it('works for UTF-8 text', () => {
    const text = 'a Ā 𐀀 文 ❤️';
    const encoded = encodeText(text);
    const decoded = decodeText(encoded);

    expect(decoded).toEqual(text);
  });

  it('works for empty strings', () => {
    const text = '';
    const encoded = encodeText(text);
    const decoded = decodeText(encoded);
    expect(decoded).toEqual(text);
  });

  it('does not simply convert to ASCII codes', () => {
    const text = 'a';
    const textAsciiHex = '61';
    const encoded = encodeText(text);
    expect(encoded).not.toEqual(textAsciiHex);
  });
});
