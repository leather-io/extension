import { Box } from 'leather-styles/jsx';

import { closeWindow } from '@shared/utils';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AcccountAddresses } from '@app/components/account/account-addresses';
import { AccountListItemLayout } from '@app/components/account/account-list-item.layout';
import { AccountNameLayout } from '@app/components/account/account-name';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { AccountAvatarItem } from '@app/ui/components/account/account-avatar/account-avatar-item';

import { GetAddressesLayout } from './components/get-addresses.layout';
import { useGetAddresses } from './use-get-addresses';

export function RpcGetAddresses() {
  const { focusInitatingTab, origin, onUserApproveGetAddresses } = useGetAddresses();
  const index = useCurrentAccountIndex();
  const stacksAccounts = useStacksAccounts();
  const stxAddress = stacksAccounts[index]?.address || '';
  const { data: name = '' } = useAccountDisplayName({ address: stxAddress, index });
  const bitcoinSigner = useNativeSegwitSigner(index);
  const bitcoinAddress = bitcoinSigner?.(0).address || '';

  useOnOriginTabClose(() => closeWindow());

  const { toggleSwitchAccount } = useSwitchAccountSheet();

  if (origin === null) {
    closeWindow();
    throw new Error('Origin is null');
  }

  return (
    <GetAddressesLayout
      requester={origin}
      onBeforeAnimation={focusInitatingTab}
      onClickRequestedByLink={focusInitatingTab}
      switchAccount={
        <AccountListItemLayout
          withChevron
          accountAddresses={<AcccountAddresses index={index} />}
          accountName={<AccountNameLayout isLoading={false}>{name}</AccountNameLayout>}
          avatar={
            <AccountAvatarItem
              index={index}
              publicKey={stacksAccounts[index]?.stxPublicKey || ''}
              name={name}
            />
          }
          balanceLabel={
            // Hack to center element without adjusting AccountListItemLayout
            <Box pos="relative" top={12}>
              <AccountTotalBalance stxAddress={stxAddress} btcAddress={bitcoinAddress} />
            </Box>
          }
          index={0}
          isLoading={false}
          isSelected={false}
          onSelectAccount={() => toggleSwitchAccount()}
        />
      }
      onUserApprovesGetAddresses={onUserApproveGetAddresses}
    />
  );
}
