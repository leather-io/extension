import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';
import { sendMessageToTab } from '@shared/messages';

interface SendRequestAccountResponseToTabArgs {
  tabId: string;
  id: string;
  account: SoftwareWalletAccountWithAddress;
}
export function sendRequestAccountResponseToTab(args: SendRequestAccountResponseToTabArgs) {
  const { tabId, id, account } = args;

  const safeAccountKeys = {
    stxPublicKey: account.stxPublicKey,
    dataPublicKey: account.dataPublicKey,
  };

  return sendMessageToTab(parseInt(tabId), id, { result: [safeAccountKeys] });
}

export function sendUserDeniesAccountRequest({ tabId, id }: { tabId: string; id: string }) {
  return sendMessageToTab(parseInt(tabId), id, { error: { code: 4000, message: 'lskdjflksjdfl' } });
}
