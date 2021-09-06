import React, { FC } from 'react';
import { useFormik } from 'formik';

import { Header } from '@components/header';
import { PopupContainer } from '@components/popup/container';
import { Body, Caption } from '@components/typography';
import { Box, Button, Flex, Stack, color } from '@stacks/ui';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

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
    <PopupContainer header={<Header title="Signing out of Hiro Wallet" />}>
      <form onChange={form.handleChange} onSubmit={form.handleSubmit}>
        <Stack spacing="loose">
          <Body>
            By signing out of your Hiro Wallet, all wallet information is deleted. You'll need your
            24-word Secret Key to access your funds.
          </Body>
          <Body>
            <strong>
              If you do not have a back up of your 24-word phrase, all wallet funds will be
              permenently lost
            </strong>
          </Body>
          <Flex as="label" alignItems="center">
            <Box mr="tight">
              <input
                type="checkbox"
                name="confirmBackup"
                data-testid={SettingsSelectors.SignOutConfirmHasBackupCheckbox}
              />
            </Box>
            <Caption userSelect="none">I have a back up of my 24-word Secret Key</Caption>
          </Flex>
          <Stack spacing="extra-loose" mt="tight">
            <Button
              type="button"
              onClick={() => onUserSafelyReturnToHomepage()}
              data-testid={SettingsSelectors.BtnSignOutReturnToHomeScreen}
            >
              Cancel operation, return safely to wallet
            </Button>
            <Flex justifyContent="center">
              <Button
                type="submit"
                display="inline-block"
                variant="link"
                fontSize="12px"
                color={form.values.confirmBackup ? color('feedback-error') : color('text-caption')}
                isDisabled={!form.values.confirmBackup}
                data-testid={SettingsSelectors.BtnSignOutActuallyDeleteWallet}
              >
                Sign out of my Hiro Wallet
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </form>
    </PopupContainer>
  );
};
