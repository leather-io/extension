import { useAtom } from 'jotai';
import { Box, Text } from '@stacks/ui';
import { correctNonceState, localOverrideNonceState } from '@store/accounts/nonce';
import { currentAccountStxAddressState } from '@store/accounts';
import { Input, InputGroup } from '@stacks/ui';
import { useAtomValue } from 'jotai/utils';
import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';

export const TxSettings: React.FC = () => {
  const MAX_LENGTH_BIG_NUMBER = 16;

  const [localNonceOverride, setLocalNonceOverride] = useAtom(localOverrideNonceState);

  const address = useAtomValue(currentAccountStxAddressState);
  if (!address) return null;
  const correctNonce = useAtomValue(correctNonceState(address));

  useEffect(() => {
    setLocalNonceOverride(correctNonce);
  }, [correctNonce, setLocalNonceOverride]);

  const handleChange = async (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    if (value.length >= MAX_LENGTH_BIG_NUMBER) return;
    let nonce;
    try {
      nonce = new BigNumber(value, 10);
    } catch (e) {
      // BN will throw an exception if not an integer, we keep the last value in that case
      return;
    }
    setLocalNonceOverride(nonce.toNumber());
  };

  return (
    <Box>
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="nonce">
          Nonce
        </Text>
        <Input
          display="block"
          width="100%"
          maxLength={MAX_LENGTH_BIG_NUMBER}
          name="nonce"
          onChange={handleChange}
          value={localNonceOverride || 0}
        />
      </InputGroup>
    </Box>
  );
};
