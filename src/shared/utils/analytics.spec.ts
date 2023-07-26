import { deriveAnalyticsIdentifier } from './analytics';

describe(deriveAnalyticsIdentifier.name, () => {
  test('the derivation of the users identifier', () =>
    expect(deriveAnalyticsIdentifier(Uint8Array.from([1, 2, 3]))).toBe('T49D6FxBz57'));

  const expectedLength = 11;

  function createRandomValue() {
    return window.crypto.getRandomValues(new Uint8Array());
  }

  test.each([
    createRandomValue(),
    createRandomValue(),
    createRandomValue(),
    createRandomValue(),
    createRandomValue(),
  ])('random test value %#', value => {
    expect(deriveAnalyticsIdentifier(value).length).toBe(expectedLength);
  });
});
