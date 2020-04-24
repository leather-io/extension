import React, { useState } from 'react';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getRPCClient } from '@common/utils';

interface FaucetResponse {
  txId?: string;
  success: boolean;
}

export const Faucet: React.FC = () => {
  const [address, setAddress] = useState('');
  const [tx, setTX] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const client = getRPCClient();

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  const getServerURL = () => {
    const { origin } = location;
    if (origin.includes('localhost')) {
      return 'http://localhost:3999';
    }
    return 'https://crashy-stacky.zone117x.com';
  };

  const waitForBalance = async (currentBalance: number, attempts: number) => {
    const { balance } = await client.fetchAccount(address);
    if (attempts > 11) {
      setError('No results after 2 minutes. Something may have gone wrong.');
      setLoading(false);
    }
    if (balance.toNumber() > currentBalance) {
      setLoading(false);
      return;
    }
    setTimeout(async () => {
      await waitForBalance(currentBalance, attempts + 1);
    }, 10000);
  };

  const onSubmit = async () => {
    setLoading(true);
    console.log(address);
    const url = `${getServerURL()}/sidecar/v1/debug/faucet?address=${address}`;
    const res = await fetch(url, {
      method: 'POST',
    });
    const data: FaucetResponse = await res.json();
    console.log(data);
    if (data.txId) {
      setTX(data.txId);
    }
    const { balance } = await client.fetchAccount(address);
    await waitForBalance(balance.toNumber(), 0);
  };

  return (
    <Box mb={6} maxWidth="600px">
      <Text as="h2" fontSize={5} mt={6}>
        Faucet
      </Text>
      <Text display="block" my={4} textStyle="caption.medium">
        Receive some free testnet STX for testing out the network. STX are required to execute smart contract functions.
      </Text>
      {tx && (
        <Text display="inline-block" my={1} fontSize={1} style={{ wordBreak: 'break-all' }}>
          TXID: {tx}
        </Text>
      )}
      {error && (
        <Text display="inline-block" my={1} fontSize={1} color="red">
          {error}
        </Text>
      )}
      <Flex wrap="wrap">
        <Box width="100%">
          <Input
            type="text"
            placeholder="Address"
            textStyle="body.small"
            value={address}
            onChange={handleInput}
            name="address"
          />
        </Box>
        <Box width="100%" mt={3} onClick={onSubmit}>
          <Button isLoading={loading} loadingText=" Waiting For TX to Confirm">
            Receive Testnet STX
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
