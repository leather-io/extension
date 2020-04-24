import React, { useState } from 'react';
import { Card } from '@cards/card';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getRPCClient } from '@common/utils';
import { standardPrincipalCV, BufferCV, deserializeCV, ClarityType } from '@blockstack/stacks-transactions';

export const ReadStatusCard: React.FC = () => {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  const onSubmit = async () => {
    const args = [standardPrincipalCV(address)];
    const client = getRPCClient();
    setLoading(true);
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
        <Box width="100%" mt={3} onClick={onSubmit}>
          <Button isLoading={loading}>Submit</Button>
        </Box>
      </Flex>
    </Card>
  );
};
