import { getAppPrivateKey } from '@stacks/wallet-sdk';
import { getSavedWalletAccounts } from './accounts-from-salt';

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
    expect(accounts[0].salt).toEqual(salt);
    expect(accounts[0].appsKey).toEqual(
      'xprv9zmyWmonWFBC5rJomHqWQQBAEnDZBB17bLVJ9DTDb5bmMAfyhWanjzaZPaqJ5USvsC2jhAtwFbNWzNz25v9Q1gw3BgAXDkSPTfa17iYxhxi'
    );
    expect(accounts[0].dataPrivateKey).toEqual(
      '98fdceb153c992a684050e8f94fab7d9eac2ac1aa147db80c78f1537602d903e'
    );
    expect(accounts[0].stxPrivateKey).toEqual(
      '14f7bc7e955ffa82ab8c8898f1bdd395ea6f5f604b2139b37b2f14fda69538ea01'
    );
    expect(appPrivateKey).toEqual(
      '1b46270b71cb192c5dfdbba35c3e13c7bfbef45ee84667dfd6769e4a1e194eef'
    );
  });

  it('unlock wallet', async () => {
    const secretKey =
      'divert dismiss popular truck neutral trend believe bleak again sample staff abstract soul weekend message amused pony child invite tenant finish pool logic check';
    const salt = 'd7de679f081291a18eadd2b987a24547';
    const highestAccountIndex = 0;

    const accounts = await getSavedWalletAccounts({ secretKey, highestAccountIndex, salt });
    const appPrivateKey = getAppPrivateKey({
      account: accounts[0],
      appDomain: 'https://www.megapont.com',
    });
    expect(accounts[0].salt).toEqual(salt);
    expect(accounts[0].appsKey).toEqual(
      'xprv9zmyWmonWFBC5rJomHqWQQBAEnDZBB17bLVJ9DTDb5bmMAfyhWanjzaZPaqJ5USvsC2jhAtwFbNWzNz25v9Q1gw3BgAXDkSPTfa17iYxhxi'
    );
    expect(accounts[0].dataPrivateKey).toEqual(
      '98fdceb153c992a684050e8f94fab7d9eac2ac1aa147db80c78f1537602d903e'
    );
    expect(accounts[0].stxPrivateKey).toEqual(
      '14f7bc7e955ffa82ab8c8898f1bdd395ea6f5f604b2139b37b2f14fda69538ea01'
    );
    expect(appPrivateKey).toEqual(
      '9a6997067289dd51dd9645f83edd50ef99a32a12dc5d79c433efa81ce88eeed2'
    );
  });
});
