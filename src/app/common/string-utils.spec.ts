import { convertUnicodeToAscii } from './string-utils';

describe(convertUnicodeToAscii.name, () => {
  it('should convert unicode to ascii', () => {
    expect(convertUnicodeToAscii('Á')).toEqual('A');
    expect(convertUnicodeToAscii('Û')).toEqual('U');
    expect(convertUnicodeToAscii('ê')).toEqual('e');
    expect(convertUnicodeToAscii('Ê')).toEqual('E');
    expect(convertUnicodeToAscii('Î')).toEqual('I');
    expect(convertUnicodeToAscii('ô')).toEqual('o');
    expect(convertUnicodeToAscii('Ô')).toEqual('O');
    expect(convertUnicodeToAscii('Ô')).not.toEqual('o');
    expect(convertUnicodeToAscii('û')).toEqual('u');
  });
});
