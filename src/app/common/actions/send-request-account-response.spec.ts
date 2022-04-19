import { sendRequestAccountResponseToTab } from './send-request-account-response';
import { sendMessageToTab } from '@shared/messages';

jest.mock('@shared/messages', () => ({
  sendMessageToTab: jest.fn().mockImplementation(() => null),
}));

describe(sendRequestAccountResponseToTab.name, () => {
  it('must only return to app with public keys', () => {
    sendRequestAccountResponseToTab({
      tabId: '2',
      id: '1',
      account: {
        stxPublicKey: 'pubKey1',
        dataPublicKey: 'dataKey1',
        stxPrivateKey: 'lskdjfjsldf',
      } as any,
    });
    expect(sendMessageToTab).toHaveBeenCalledTimes(1);
    expect(sendMessageToTab).toHaveBeenCalledWith(2, '1', {
      result: [{ dataPublicKey: 'dataKey1', stxPublicKey: 'pubKey1' }],
    });
  });
});
