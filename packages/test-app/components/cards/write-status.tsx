import React, { useState } from 'react';
import { Card } from '@cards/card';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getAuthOrigin } from '@common/utils';
import { useConnect, ContractCallArgumentType } from '@blockstack/connect';

export const WriteStatusCard: React.FC = () => {
  const { doContractCall } = useConnect();
  const [status, setStatus] = useState('');

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setStatus(evt.currentTarget.value || '');
  };

  const onSubmit = async () => {
    const authOrigin = getAuthOrigin();
    await doContractCall({
      authOrigin,
      contractAddress: 'ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH',
      functionName: 'write-status!',
      functionArgs: [{ value: status, type: ContractCallArgumentType.BUFFER }],
      contractName: 'status',
      finished: data => {
        console.log('finished!', data);
      },
    });
  };

  return (
    <Card title="Status Contract">
      <Flex justifyContent="center" wrap="wrap">
        <Text display="inline-block">Save a small phrase on the Stacks Blockchain.</Text>
        <Box width="100%" mt={3}>
          <Input
            type="text"
            placeholder="Status"
            textStyle="body.small"
            value={status}
            onChange={handleInput}
            name="status"
          />
        </Box>
        <Box width="100%" mt={3} onClick={onSubmit}>
          <Button>Submit</Button>
        </Box>
      </Flex>
    </Card>
  );
};
