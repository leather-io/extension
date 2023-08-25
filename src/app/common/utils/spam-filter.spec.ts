import { spamFilter, spamReplacement } from '@app/common/utils/spam-filter';

describe('Spam filter', () => {
  it('should allow valid tokens', () => {
    expect(spamFilter('This token name is OK')).not.toEqual(spamReplacement);
  });
  it('should detect spam urls in strings and replace content', () => {
    expect(spamFilter('www.fake')).toEqual(spamReplacement);
    expect(spamFilter('https://www.fake.com')).toEqual(spamReplacement);
    expect(spamFilter('fake.com')).toEqual(spamReplacement);
    expect(spamFilter('https://www.fake')).toEqual(spamReplacement);
    expect(spamFilter('http://www.fake')).toEqual(spamReplacement);
    expect(spamFilter('ftp://fake.com')).toEqual(spamReplacement);
    expect(spamFilter('https://fake.com')).toEqual(spamReplacement);
    expect(spamFilter('http://fake.com')).toEqual(spamReplacement);
    expect(spamFilter('https://fake')).toEqual(spamReplacement);
    expect(spamFilter('http://fake')).toEqual(spamReplacement);
  });
  it('should detect spam words in strings and replace content', () => {
    expect(spamFilter('You won some stx')).toEqual(spamReplacement);
    expect(spamFilter('You Win some stx')).toEqual(spamReplacement);
    expect(spamFilter('You Won some stx')).toEqual(spamReplacement);
    expect(spamFilter('click here for some stx')).toEqual(spamReplacement);
    expect(spamFilter('Click here for some stx')).toEqual(spamReplacement);
  });
});
