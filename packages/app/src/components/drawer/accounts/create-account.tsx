import React, { useEffect } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';
import { useDispatch } from '@common/hooks/use-dispatch';
import { didGenerateWallet, doSetIdentityIndex } from '@store/wallet/actions';
import { useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil';

interface CreateAccountProps {
  close: () => void;
}
export const CreateAccount: React.FC<CreateAccountProps> = ({ close }) => {
  const { wallet } = useWallet();
  const dispatch = useDispatch();
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  useEffect(() => {
    const addAccount = async () => {
      if (!wallet) {
        throw new Error('Trying to add account when not logged in.');
      }
      await wallet.createNewIdentity(DEFAULT_PASSWORD);
      await dispatch(didGenerateWallet(wallet));
      await dispatch(doSetIdentityIndex(wallet.identities.length - 1));
    };
    void addAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box width="100%" px={6}>
      <Box>
        <Text fontSize={4} fontWeight="600">
          Account Created
        </Text>
      </Box>
      <Box py="base">
        <Text>
          Your new account has been created. A username makes your account easy to recognize. Would
          you like to add a username?
        </Text>
      </Box>
      <Flex width="100%" flexGrow={1} mt="base">
        <Button
          color="blue"
          width="50%"
          mr={2}
          customStyles={{
            primary: {
              backgroundColor: '#F2F2FF',
            },
            secondary: {},
            tertiary: {},
          }}
          onClick={close}
        >
          Skip username
        </Button>
        <Button width="50%" ml={2} onClick={() => setAccountDrawerStep(AccountStep.Username)}>
          Add username
        </Button>
      </Flex>
    </Box>
  );
};
