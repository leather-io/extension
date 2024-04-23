import { Outlet } from 'react-router-dom';

import { closeWindow } from '@shared/utils';

import { Disclaimer } from '@app/components/disclaimer';
import { NoFeesWarningRow } from '@app/components/no-fees-warning-row';
import { MessagePreviewBox } from '@app/features/message-signer/message-preview-box';
import { MessageSigningRequestLayout } from '@app/features/message-signer/message-signing-request.layout';
import { AccountGate } from '@app/routes/account-gate';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { MessageSigningHeader } from '../../features/message-signer/message-signing-header';
import { SignMessageActions } from '../../features/message-signer/stacks-sign-message-action';
import { useSignBip322Message } from './use-sign-bip322-message';

// Imported dynamically
// ts-unused-exports:disable-next-line
export function RpcSignBip322MessageRoute() {
  return (
    <AccountGate>
      <RpcSignBip322Message />
    </AccountGate>
  );
}

function RpcSignBip322Message() {
  const {
    origin,
    message,
    address,
    isLoading,
    onUserApproveBip322MessageSigningRequest,
    onUserRejectBip322MessageSigningRequest,
  } = useSignBip322Message();

  const { chain } = useCurrentNetwork();

  if (origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  return (
    <>
      <Outlet />
      <MessageSigningRequestLayout>
        <MessageSigningHeader
          origin={origin}
        />
        <MessagePreviewBox message={message} />
        <NoFeesWarningRow chainId={chain.stacks.chainId} />
        <SignMessageActions
          isLoading={isLoading}
          onSignMessage={() => onUserApproveBip322MessageSigningRequest()}
          onSignMessageCancel={() => onUserRejectBip322MessageSigningRequest()}
        />
        <hr />
        <Disclaimer
          disclaimerText={`By signing this message, you prove that you own address ${truncateMiddle(address)}.`}
          mb="space.05"
        />
      </MessageSigningRequestLayout>
    </>
  );
}
