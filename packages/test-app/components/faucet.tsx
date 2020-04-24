import React, { useState } from 'react';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getRPCClient } from '@common/utils';

interface FaucetResponse {
  tx?: string;
  success: boolean;
}

export const Faucet: React.FC = () => {
  const [address, setAddress] = useState('');
  const [tx, setTX] = useState('');

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

  const onSubmit = async () => {
    console.log(address);
    const url = `${getServerURL()}/sidecar/v1/debug/faucet?address=${address}`;
    const res = await fetch(url, {
      method: 'POST',
    });
    const data: FaucetResponse = await res.json();
    if (data.tx) {
      setTX(data.tx);
      const buf = Buffer.from(data.tx, 'hex');
      const client = getRPCClient();
      await client.broadcastTX(buf);
    }
    console.log(data);
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
        <Text display="inline-block" my={3} fontSize={1} style={{ wordBreak: 'break-all' }}>
          {tx}
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
          <Button>Receive Testnet STX</Button>
        </Box>
      </Flex>
    </Box>
  );
};
