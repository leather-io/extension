import React, { useState } from 'react';
import { Card } from '@cards/card';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';

interface FaucetResponse {
  tx?: string;
  success: boolean;
}

export const FaucetCard: React.FC = () => {
  const [address, setAddress] = useState('');
  const [tx, setTX] = useState('');

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  const getServerURL = () => {
    // TODO: use production server URL
    // const { hostname } = document.location;
    // if (hostname.includes('deploy-preview')) {
    //   return `https://${hostname.rec}`
    // }
    return 'http://localhost:5555';
  };

  const onSubmit = async () => {
    console.log(address);
    const url = `${getServerURL()}/api/faucet?address=${address}`;
    const res = await fetch(url, {
      method: 'POST',
    });
    const data: FaucetResponse = await res.json();
    if (data.tx) {
      setTX(data.tx);
    }
    console.log(data);
  };

  return (
    <Card title="Faucet">
      <Text display="inline-block">Receive some free testnet STX for testing out the network.</Text>
      <Text display="inline-block" my={3} fontSize={1} style={{ wordBreak: 'break-all' }}>
        {tx}
      </Text>
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
    </Card>
  );
};
