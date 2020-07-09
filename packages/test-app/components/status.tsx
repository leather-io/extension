import React, { useState } from 'react';
import { space, Box, Text, Button, Input } from '@blockstack/ui';
import { ExplorerLink } from './explorer-link';
import { ContractCallArgumentType, useConnect } from '@blockstack/connect';
import {
  PostConditionMode,
  standardPrincipalCV,
  BufferCV,
  deserializeCV,
  ClarityType,
} from '@blockstack/stacks-transactions';
import { getAuthOrigin, getRPCClient } from '@common/utils';

export const Status = () => {
  const [status, setStatus] = useState('');
  const [readStatus, setReadStatus] = useState('');
  const [address, setAddress] = useState('');
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { doContractCall } = useConnect();

  const getAddressCV = () => {
    try {
      return standardPrincipalCV(address);
    } catch (error) {
      setError('Invalid address.');
      return null;
    }
  };

  const onSubmitRead = async () => {
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
        setReadStatus(str);
        console.log(str);
      }
    } catch (error) {
      setError('An error occurred while fetching the status contract.');
    }
    setLoading(false);
  };

  const onSubmitWrite = async () => {
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
      postConditionMode: PostConditionMode.Deny,
    });
  };

  const handleStatus = (evt: React.FormEvent<HTMLInputElement>) => {
    setStatus(evt.currentTarget.value || '');
  };

  const handleAddress = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Status smart contract
      </Text>
      <Text textStyle="body.large" display="block" my={space('loose')}>
        Try a smart contract where anyone can write their public status, like a decentralized
        Twitter. You can read someone else's status by entering their address.
      </Text>
      <ExplorerLink
        txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.status"
        text="View contract in explorer"
        skipConfirmCheck
      />

      <Text display="block" my={space('base-loose')} textStyle="body.large.medium">
        Write a status
      </Text>

      <Box width="100%" mt={3}>
        <Input
          type="text"
          placeholder="Status"
          textStyle="body.small"
          value={status}
          onChange={handleStatus}
          name="status"
          maxWidth="300px"
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'enter') {
              onSubmitWrite();
            }
          }}
        />
      </Box>
      {txId && <ExplorerLink txId={txId} />}
      <Button my={space('base-loose')} onClick={onSubmitWrite}>
        Write status
      </Button>

      <Text display="block" my={space('base-loose')} textStyle="body.large.medium">
        Read a status
      </Text>

      <Box width="100%" mt={3}>
        <Input
          type="text"
          placeholder="Status"
          textStyle="body.small"
          value={address}
          onChange={handleAddress}
          name="status"
          maxWidth="300px"
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'enter') {
              onSubmitRead();
            }
          }}
        />
      </Box>

      {readStatus && (
        <Text display="block" fontWeight={600} my={3} width="100%">
          {readStatus}
        </Text>
      )}

      {error && (
        <Text display="block" color="red" width="100%" fontSize={1} mt={2}>
          {error}
        </Text>
      )}
      <Button my={space('base-loose')} onClick={onSubmitRead} isLoading={loading}>
        Read status
      </Button>
    </Box>
  );
};
