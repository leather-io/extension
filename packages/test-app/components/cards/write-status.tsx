import React, { useState } from 'react';
import { Card } from '@cards/card';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getAuthOrigin } from '@common/utils';
import { useConnect, ContractCallArgumentType } from '@blockstack/connect';
import { ExplorerLink } from '@components/explorer-link';

export const WriteStatusCard: React.FC = () => {
  const { doContractCall } = useConnect();
  const [status, setStatus] = useState('');
  const [txId, setTxId] = useState('');

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setStatus(evt.currentTarget.value || '');
  };

  const onSubmit = async () => {
    const authOrigin = getAuthOrigin();
    await doContractCall({
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      functionName: 'write-status!',
      functionArgs: [{ value: status, type: ContractCallArgumentType.BUFFER }],
      contractName: 'status',
      finished: data => {
        setTxId(data.txId);
        console.log('finished!', data);
      },
    });
  };

  return (
    <Card title="Status Contract">
      <Flex wrap="wrap">
        <Text display="inline-block">Save a small phrase on the Stacks Blockchain.</Text>
        {txId && <ExplorerLink txId={txId} />}
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
