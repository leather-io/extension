import React, { FC } from 'react';
import { useFormik } from 'formik';

import { Body, Caption } from '@components/typography';
import { Box, Button, Flex, color } from '@stacks/ui';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { BaseDrawer } from '@components/drawer';

interface SignOutConfirmLayoutProps {
  onUserDeleteWallet(): void;
  onUserSafelyReturnToHomepage(): void;
}
export const SignOutConfirmLayout: FC<SignOutConfirmLayoutProps> = props => {
  const { onUserDeleteWallet, onUserSafelyReturnToHomepage } = props;

  const form = useFormik({
    initialValues: { confirmBackup: false },
    onSubmit() {
      onUserDeleteWallet();
    },
  });

  return (
    <BaseDrawer title="Sign out" isShowing onClose={onUserSafelyReturnToHomepage}>
      <Box mx="loose" mb="extra-loose">
        <form onChange={form.handleChange} onSubmit={form.handleSubmit}>
          <Body>
            When you sign out, you’ll need your 24-word Secret Key to sign back in. Only sign out if
            you’ve backed up your Secret Key.
          </Body>

          <Flex as="label" alignItems="center" mt="loose">
            <Box mr="tight">
              <input
                type="checkbox"
                name="confirmBackup"
                data-testid={SettingsSelectors.SignOutConfirmHasBackupCheckbox}
              />
            </Box>
            <Caption userSelect="none">I've backed up my 24-word Secret Key</Caption>
          </Flex>
          <Flex mt="loose">
            <Button
              flex={1}
              type="button"
              onClick={() => onUserSafelyReturnToHomepage()}
              mode="tertiary"
              mr="base-tight"
              data-testid={SettingsSelectors.BtnSignOutReturnToHomeScreen}
            >
              Cancel
            </Button>
            <Button
              flex={1}
              type="submit"
              mode="primary"
              background={color('feedback-error')}
              _hover={{ background: color('feedback-error') }}
              isDisabled={!form.values.confirmBackup}
              data-testid={SettingsSelectors.BtnSignOutActuallyDeleteWallet}
            >
              Sign out
            </Button>
          </Flex>
        </form>
      </Box>
    </BaseDrawer>
  );
};
