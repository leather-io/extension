import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { useFormik } from 'formik';
import { Flex, HStack, styled } from 'leather-styles/jsx';

import { Button, Callout, Sheet, SheetHeader } from '@leather.io/ui';

import { useWalletType } from '@app/common/use-wallet-type';
import { ButtonRow } from '@app/components/layout';

interface SignOutSheetProps {
  isShowing: boolean;
  onUserDeleteWallet(): void;
  onClose(): void;
}
export function SignOutSheet({ isShowing, onUserDeleteWallet, onClose }: SignOutSheetProps) {
  const { whenWallet, walletType } = useWalletType();
  const form = useFormik({
    initialValues: {
      confirmBackup: whenWallet({ ledger: true, software: false }),
      confirmPasswordDisable: whenWallet({ ledger: true, software: false }),
    },
    onSubmit() {
      handleSignOut();
    },
  });

  const canSignOut = form.values.confirmBackup && form.values.confirmPasswordDisable;

  function handleSignOut() {
    if (canSignOut) {
      onClose();
      onUserDeleteWallet();
    }
  }

  return (
    <Sheet
      header={<SheetHeader title="Sign out" />}
      isShowing={isShowing}
      onClose={onClose}
      footer={
        <ButtonRow flexDirection="row">
          <Button
            color="gray"
            data-testid={SettingsSelectors.BtnSignOutReturnToHomeScreen}
            flexGrow={1}
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="lightModeInk.1"
            opacity={!canSignOut ? 0.8 : undefined}
            data-testid={SettingsSelectors.BtnSignOutActuallyDeleteWallet}
            flexGrow={1}
            disabled={!canSignOut}
            onClick={handleSignOut}
            type="submit"
          >
            Sign out
          </Button>
        </ButtonRow>
      }
    >
      <Callout variant="warning" width="100%" title="You'll need your Secret Key to sign in again">
        {whenWallet({
          software:
            "Back up your Secret Key before signing out. You'll be asked for your Secret Key on your next login.",
          ledger:
            "When you sign out, you'll need to reconnect your Ledger to sign back into your wallet.",
        })}
      </Callout>
      <Flex alignItems="center" flexDirection="column" p="space.05">
        <form onChange={form.handleChange} onSubmit={form.handleSubmit}>
          <styled.label alignItems="center" display={walletType === 'software' ? 'flex' : 'none'}>
            <HStack gap="space.03">
              <input
                type="checkbox"
                name="confirmBackup"
                defaultChecked={form.values.confirmBackup}
                data-testid={SettingsSelectors.SignOutConfirmHasBackupCheckbox}
              />

              <styled.p textStyle="caption.01" userSelect="none">
                I have backed up my Secret Key.
              </styled.p>
            </HStack>
          </styled.label>
          <styled.label
            alignItems="center"
            mt="space.05"
            display={walletType === 'software' ? 'flex' : 'none'}
          >
            <HStack gap="space.03">
              <input
                type="checkbox"
                name="confirmPasswordDisable"
                defaultChecked={form.values.confirmPasswordDisable}
                data-testid={SettingsSelectors.SignOutConfirmPasswordDisable}
              />
              <styled.p textStyle="caption.01" userSelect="none">
                I understand that my password will not give me access to my wallet after I sign out.
              </styled.p>
            </HStack>
          </styled.label>
        </form>
      </Flex>
    </Sheet>
  );
}
