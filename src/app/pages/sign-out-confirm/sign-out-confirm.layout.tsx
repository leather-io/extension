import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { useFormik } from 'formik';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { useWalletType } from '@app/common/use-wallet-type';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Flag } from '@app/components/layout/flag';
import { Button } from '@app/ui/components/button/button';
import { ErrorIcon } from '@app/ui/components/icons/error-icon';

interface SignOutConfirmLayoutProps {
  onUserDeleteWallet(): void;
  onUserSafelyReturnToHomepage(): void;
}
export function SignOutConfirmLayout(props: SignOutConfirmLayoutProps) {
  const { onUserDeleteWallet, onUserSafelyReturnToHomepage } = props;

  const { whenWallet, walletType } = useWalletType();
  const { theme } = useThemeSwitcher();

  const form = useFormik({
    initialValues: {
      confirmBackup: whenWallet({ ledger: true, software: false }),
      confirmPasswordDisable: whenWallet({ ledger: true, software: false }),
    },
    onSubmit() {
      onUserDeleteWallet();
    },
  });

  return (
    <BaseDrawer title="Sign out" isShowing onClose={onUserSafelyReturnToHomepage}>
      <Box mx="space.05" mb="space.06">
        <form onChange={form.handleChange} onSubmit={form.handleSubmit}>
          <styled.p textStyle="label.02">
            When you sign out,
            {whenWallet({
              software: ` you'll need your Secret Key to sign back in. Only sign out if you've backed up your Secret Key.`,
              ledger: ` you'll need to reconnect your Ledger to sign back into your wallet.`,
            })}
          </styled.p>
          <styled.div mt="space.05" textStyle="label.02">
            {whenWallet({
              software: (
                <Flag align="middle" img={<ErrorIcon />} spacing="space.02">
                  If you haven't backed up your Secret Key, you will lose all your funds.
                </Flag>
              ),
              ledger: <></>,
            })}
          </styled.div>
          <styled.label
            alignItems="center"
            mt="space.05"
            display={walletType === 'software' ? 'flex' : 'none'}
          >
            <Box mr="space.03">
              <input
                type="checkbox"
                name="confirmBackup"
                defaultChecked={form.values.confirmBackup}
                data-testid={SettingsSelectors.SignOutConfirmHasBackupCheckbox}
              />
            </Box>
            <styled.p textStyle="caption.01" userSelect="none">
              I've backed up my Secret Key
            </styled.p>
          </styled.label>
          <styled.label
            alignItems="center"
            mt="space.02"
            display={walletType === 'software' ? 'flex' : 'none'}
          >
            <Box mr="space.03">
              <input
                type="checkbox"
                name="confirmPasswordDisable"
                defaultChecked={form.values.confirmPasswordDisable}
                data-testid={SettingsSelectors.SignOutConfirmPasswordDisable}
              />
            </Box>
            <styled.p textStyle="caption.01" userSelect="none">
              I understand my password will no longer work for accessing my wallet upon signing out
            </styled.p>
          </styled.label>
          <HStack gap="space.04" mt="space.06">
            <Button
              data-testid={SettingsSelectors.BtnSignOutReturnToHomeScreen}
              flexGrow={1}
              onClick={() => onUserSafelyReturnToHomepage()}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              _disabled={{ color: 'accent.non-interactive' }}
              _hover={{ background: 'error.label' }}
              background="error.label"
              color={theme === 'light' ? 'accent.background-primary' : 'accent.text-primary'}
              data-testid={SettingsSelectors.BtnSignOutActuallyDeleteWallet}
              flexGrow={1}
              disabled={!(form.values.confirmBackup && form.values.confirmPasswordDisable)}
              type="submit"
            >
              Sign out
            </Button>
          </HStack>
        </form>
      </Box>
    </BaseDrawer>
  );
}
