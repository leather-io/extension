import { formatAccountName } from '@app/common/utils/format-account-name';

describe('formatAccountName', () => {
  it("should return '' if input is undefined", () => {
    expect(formatAccountName(undefined)).toBe('');
  });

  it('should return the input as is if it is shorter than the maximum length', () => {
    const input = 'short.stx';
    expect(formatAccountName(input)).toEqual(input);
  });

  it('should truncate the input and insert "…" in the middle if it is longer than the maximum length', () => {
    const input = 'wwwwwwwwwwwwwwwwwwwww.stx';
    expect(formatAccountName(input)).toEqual('wwww…wwww.stx');
  });
});
