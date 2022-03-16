import { getSavedWalletAccounts } from '@background/accounts-from-salt';
import { getAppPrivateKey } from '@stacks/wallet-sdk';

describe('test unlock', () => {
  it('unlock wallet', async () => {
    const secretKey =
      'divert dismiss popular truck neutral trend believe bleak again sample staff abstract soul weekend message amused pony child invite tenant finish pool logic check';
    const salt = '1be7c103ceab12816ae122ea919503b8';

    const highestAccountIndex = 0;
    const accounts = await getSavedWalletAccounts({ secretKey, highestAccountIndex, salt });
    const appPrivateKey = getAppPrivateKey({
      account: accounts[0],
      appDomain: 'https://www.megapont.com',
    });
    expect(appPrivateKey).toEqual(
      '1b46270b71cb192c5dfdbba35c3e13c7bfbef45ee84667dfd6769e4a1e194eef'
    );
    console.log('appPrivateKey', appPrivateKey);
  });
});
