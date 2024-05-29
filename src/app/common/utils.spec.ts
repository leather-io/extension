import { getTicker } from '@app/common/utils';

const nothing = 'micro-nothing';
const novel_token_19 = 'novel-token-19';
const stella = 'stella';

describe(getTicker.name, () => {
  test('Get accurate ticker from many strings', () => {
    const mno = getTicker(nothing);
    const nt1 = getTicker(novel_token_19);
    const ste = getTicker(stella);
    expect(mno).toEqual('MNO');
    expect(nt1).toEqual('NT1');
    expect(ste).toEqual('STE');
  });
});
