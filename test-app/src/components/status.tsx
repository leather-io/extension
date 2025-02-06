import React, { useState } from 'react';

import {
  BufferCV,
  ClarityType,
  PostConditionMode,
  bufferCV,
  deserializeCV,
  standardPrincipalCV,
} from '@blockstack/stacks-transactions';
import { useSTXAddress } from '@common/use-stx-address';
import { getRPCClient, stacksTestnetNetwork as network } from '@common/utils';
import { TxCard } from '@components/tx-card';
import { useConnect } from '@stacks/connect-react-jwt';
import type { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { ExplorerLink } from './explorer-link';

export const Status = () => {
  const stxAddress = useSTXAddress();
  const [status, setStatus] = useState('');
  const [readStatus, setReadStatus] = useState('');
  const [address, setAddress] = useState('');
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions] = useState<ContractCallTransaction[]>([]);
  const { doContractCall } = useConnect();

  const client = getRPCClient();

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
    const statusArg = bufferCV(Buffer.from(status));
    await doContractCall({
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      functionName: 'write-status!',
      network,
      functionArgs: [statusArg],
      contractName: 'status',
      onFinish: data => {
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
      <styled.h2 textStyle="display.small">Status smart contract</styled.h2>
      <styled.span textStyle="body.large" display="block" my="space.05">
        Try a smart contract where anyone can write their public status, like a decentralized
        Twitter. You can read someone else's status by entering their address.
      </styled.span>
      <ExplorerLink
        txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.status"
        text="View contract in explorer"
        skipConfirmCheck
      />

      {transactions.length > 0 && (
        <>
          <styled.span display="block" my="space.04" textStyle="body.large.medium">
            Latest statuses
          </styled.span>
          <Flex flexWrap="wrap" justifyContent="left">
            {transactions.slice(0, 3).map(t => (
              <TxCard tx={t} label={JSON.parse(t.tx_result?.repr || '')} />
            ))}
          </Flex>
        </>
      )}

      <styled.span display="block" my="space.04" textStyle="body.large.medium">
        Write a status
      </styled.span>

      <Box width="100%" mt={3}>
        <styled.input
          type="text"
          placeholder="Enter your status"
          textStyle="body.small"
          value={status}
          onChange={handleStatus}
          name="status"
          maxWidth="300px"
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'enter') {
              void onSubmitWrite();
            }
          }}
        />
      </Box>
      {txId && <ExplorerLink txId={txId} />}
      <styled.button my="space.04" onClick={onSubmitWrite}>
        Write status
      </styled.button>

      <styled.span display="block" my="space.04" textStyle="body.large.medium">
        Read a status
      </styled.span>

      {stxAddress && (
        <styled.span display="block" my="space.04" textStyle="body.small">
          If you want to read your own status, your address is {stxAddress}.
        </styled.span>
      )}

      <Box width="100%" mt={3}>
        <styled.input
          type="text"
          placeholder="Enter an STX address"
          textStyle="body.small"
          value={address}
          onChange={handleAddress}
          name="status"
          maxWidth="300px"
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'enter') {
              void onSubmitRead();
            }
          }}
        />
      </Box>

      {readStatus && (
        <styled.span display="block" fontWeight={600} my={3} width="100%">
          {readStatus}
        </styled.span>
      )}

      {error && (
        <styled.span display="block" color="red" width="100%" mt={2}>
          {error}
        </styled.span>
      )}
      <styled.button my="space.04" onClick={onSubmitRead} disabled={loading}>
        Read status
      </styled.button>
    </Box>
  );
};
