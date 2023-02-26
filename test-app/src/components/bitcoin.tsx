import React, { useContext } from 'react';

import { AppContext } from '@common/context';
import { stacksTestnetNetwork } from '@common/utils';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { PsbtData, PsbtRequestOptions } from '@stacks/connect';
import { useConnect } from '@stacks/connect-react';
import { StacksNetwork } from '@stacks/network';
import { Box, Button, Text } from '@stacks/ui';
import * as btc from 'micro-btc-signer';

interface BitcoinNetwork {
  bech32: string;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
}

const bitcoinTestnet: BitcoinNetwork = {
  bech32: 'tb',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

function buildTestPsbtRequest(pubKey: Uint8Array): PsbtRequestOptions {
  const p2wpkh = btc.p2wpkh(pubKey, bitcoinTestnet);

  const tx = new btc.Transaction();

  tx.addInput({
    index: 0,
    txid: '15f34b3bd2aab555a003cd1c6959ac09b36239c6af1cb16ff8198cef64f8db9c',
    witnessUtxo: {
      amount: BigInt(1000),
      script: p2wpkh.script,
    },
  });

  const psbt = tx.toPSBT();

  return { signAtIndex: 0, txHex: bytesToHex(psbt) };
}

export const Bitcoin = () => {
  const { userData } = useContext(AppContext);
  const { signPsbt } = useConnect();
  const pubKey = hexToBytes(userData?.profile.btcPublicKey.p2wpkh);

  const signTx = async (options: PsbtRequestOptions, network?: StacksNetwork) => {
    const defaultNetwork = stacksTestnetNetwork;

    await signPsbt({
      ...options,
      network: network ?? defaultNetwork,
      onFinish: (data: PsbtData) => {
        console.log('psbt', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Bitcoin
      </Text>
      <Text textStyle="body.large" display="block" my={'loose'}>
        Try testing Partially Signed Bitcoin Transactions.
      </Text>
      <Button mt={3} onClick={() => signTx(buildTestPsbtRequest(pubKey), stacksTestnetNetwork)}>
        Sign PSBT
      </Button>
    </Box>
  );
};
