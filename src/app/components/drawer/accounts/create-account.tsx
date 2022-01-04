import { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Button, Stack } from '@stacks/ui';
import { Body } from '@app/components/typography';
import { SettingsSelectors } from '@tests/integration/settings.selectors';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useGeneratedCurrentWallet } from '@app/store/chains/stx-chain.actions';
import { Wallet } from '@stacks/wallet-sdk';

interface CreateAccountProps {
  close: () => void;
}

const TIMEOUT = 3000;

export const CreateAccount: React.FC<CreateAccountProps> = ({ close }) => {
  const { createNewAccount } = useKeyActions();
  const wallet = useGeneratedCurrentWallet();
  const [isSetting, setSetting] = useState(false);
  const [hasFired, setHasFired] = useState(false);
  const analytics = useAnalytics();

  const createAccount = useCallback(
    async (wallet: Wallet) => {
      if (!isSetting) {
        setSetting(true);
        await createNewAccount(wallet);
        void analytics.track('create_new_account');
        setSetting(false);
        window.setTimeout(() => close(), TIMEOUT);
      }
    },
    [isSetting, createNewAccount, analytics, close]
  );

  useEffect(() => {
    if (!hasFired && wallet) {
      setHasFired(true);
      void createAccount(wallet);
    }
  }, [createAccount, hasFired, wallet]);

  return (
    <Box width="100%" px="extra-loose">
      <Stack spacing="base">
        <Body>Your new account has been created.</Body>
        <Flex width="100%" flexGrow={1} mt="base" pb="loose">
          <Button
            width="100%"
            onClick={close}
            isLoading={isSetting}
            borderRadius="10px"
            isDisabled={isSetting}
            data-testid={isSetting ? undefined : SettingsSelectors.BtnCreateAccountDone}
          >
            Done
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
