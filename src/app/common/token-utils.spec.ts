import { isFtNameLikeStx, isIconUrl } from './token-utils';

describe(isFtNameLikeStx.name, () => {
  it('detect impersonating token names', () => {
    expect(isFtNameLikeStx('STX')).toBeTruthy();
    expect(isFtNameLikeStx('stx')).toBeTruthy();
    expect(isFtNameLikeStx('stacks')).toBeTruthy();
    expect(isFtNameLikeStx('Stäcks')).toBeTruthy();
    expect(isFtNameLikeStx('Stácks')).toBeTruthy();
    expect(isFtNameLikeStx('Stáçks')).toBeTruthy();
    expect(isFtNameLikeStx('stocks')).toBeFalsy();
    expect(isFtNameLikeStx('miamicoin')).toBeFalsy();
    expect(isFtNameLikeStx('')).toBeFalsy();
  });
});

describe(isIconUrl.name, () => {
  it('detect valid icon url', () => {
    expect(isIconUrl('https://example.com/icon.png')).toBeTruthy();
    expect(isIconUrl('')).toBeFalsy();
    expect(isIconUrl('https://example.com/icon.png?foo=bar')).toBeTruthy();
    expect(isIconUrl('SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token')).toBeFalsy();
  });
});
