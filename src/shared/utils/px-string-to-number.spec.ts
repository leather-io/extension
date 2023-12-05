import { pxStringToNumber } from './px-string-to-number';

describe('convert px string to number for calculation', () => {
  it('converts standard px string to number', () => {
    const result = pxStringToNumber('10px');
    expect(result).toEqual(10);
  });
  it('converts token px string to number', () => {
    const result = pxStringToNumber('600px');
    expect(result).toEqual(600);
  });
});
