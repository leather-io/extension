import React, { useState } from 'react';
import { Card } from '@cards/card';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getRPCClient } from '@common/utils';
import {
  standardPrincipalCV,
  BufferCV,
  deserializeCV,
  ClarityType,
} from '@blockstack/stacks-transactions';

export const ReadStatusCard: React.FC = () => {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  const getAddressCV = () => {
    try {
      return standardPrincipalCV(address);
    } catch (error) {
      setError('Invalid address.');
      return null;
    }
  };

  const onSubmit = async () => {
    const addressCV = getAddressCV();
    if (!addressCV) {
      return;
    }
    const args = [addressCV];
    const client = getRPCClient();
    setLoading(true);
    try {
      const data = await client.callReadOnly({
        contractName: 'status',
        contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
        args,
        functionName: 'get-status',
      });
      console.log(data);
      const cv = deserializeCV(Buffer.from(data.result.slice(2), 'hex')) as BufferCV;
      console.log(cv);
      if (cv.type === ClarityType.Buffer) {
        const ua = Array.from(cv.buffer);
        const str = String.fromCharCode.apply(null, ua);
        setResult(str);
        console.log(str);
      }
    } catch (error) {
      setError('An error occurred while fetching the status contract.');
    }
    setLoading(false);
  };

  return (
    <Card title="Read Status">
      <Flex wrap="wrap">
        <Text display="block">Fetch the status for a specific address.</Text>
        {result && (
          <Text display="block" fontWeight={600} my={3} width="100%">
            {result}
          </Text>
        )}
        <Box width="100%" mt={3}>
          <Input
            type="text"
            placeholder="Status"
            textStyle="body.small"
            value={address}
            onChange={handleInput}
            name="stacks-address"
          />
        </Box>
        {error && (
          <Text display="block" color="red" width="100%" fontSize={1} mt={2}>
            {error}
          </Text>
        )}
        <Box width="100%" mt={3} onClick={onSubmit}>
          <Button isLoading={loading}>Submit</Button>
        </Box>
      </Flex>
    </Card>
  );
};
