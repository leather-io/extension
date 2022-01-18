import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Flex, Input, Text } from '@stacks/ui';
import { useFormik } from 'formik';

import {
  stacksLocalhostNetwork,
  stacksRegtestNetwork,
  stacksTestnetNetwork,
  stacksTestnetNetwork as network,
} from '@common/utils';
import { demoTokenContract } from '@common/contracts';
import { useSTXAddress } from '@common/use-stx-address';
import { useConnect } from '@stacks/connect-react';
import {
  bufferCV,
  bufferCVFromString,
  createAssetInfo,
  createNonFungiblePostCondition,
  FungibleConditionCode,
  intCV,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  noneCV,
  NonFungibleConditionCode,
  PostConditionMode,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  trueCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';
import { ExplorerLink } from './explorer-link';
import BN from 'bn.js';
import { StacksTestnet } from '@stacks/network';

export const Debugger = () => {
  const { doContractCall, doSTXTransfer, doContractDeploy } = useConnect();
  const address = useSTXAddress();

  const [txId, setTxId] = useState<string>('');
  const [txType, setTxType] = useState<string>('');

  const clearState = () => {
    setTxId('');
    setTxType('');
  };

  const setState = (type: string, id: string) => {
    setTxId(id);
    setTxType(type);
  };

  const callBnsTransfer = async () => {
    // this will fail because the address does not own the name
    clearState();
    const args = [
      bufferCVFromString('id'), // namespace
      bufferCVFromString('stella'), // name
      standardPrincipalCV('ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3'), // recipient
      noneCV(), // zonefile
    ];
    await doContractCall({
      network,
      contractAddress: 'ST000000000000000000002AMW42H',
      contractName: 'bns',
      functionName: 'name-transfer',
      functionArgs: args,
      attachment: 'This is an attachment',
      postConditions: [
        createNonFungiblePostCondition(
          address || '', // the sender
          NonFungibleConditionCode.DoesNotOwn, // will not own this NFT anymore
          createAssetInfo('ST000000000000000000002AMW42H', 'bns', 'names'), // bns NFT
          tupleCV({
            name: bufferCVFromString('stella'),
            namespace: bufferCVFromString('id'),
          }) // the name
        ),
      ],
      onFinish: data => {
        console.log('finished bns call!', data);
        setState('Contract Call', data.txId);
      },
    });
  };

  const callAnimalTransfer = async () => {
    clearState();
    const args = [
      uintCV(1),
      standardPrincipalCV('ST3K6AFDAW05G6Z9FWZD61RBRN6WV1J2N4MJG43JJ'), // sender
      standardPrincipalCV('ST9VQ21ZEGG54JDFE39B99ZBTSFSWMEC323MENFG'), // recipient
    ];
    await doContractCall({
      network,
      contractAddress: 'ST9VQ21ZEGG54JDFE39B99ZBTSFSWMEC323MENFG',
      contractName: 'animal',
      functionName: 'transfer',
      functionArgs: args,
      postConditionMode: PostConditionMode.Allow,
      postConditions: [],
      onFinish: data => {
        console.log('finished nft transfer!', data);
        setState('Contract Call', data.txId);
      },
    });
  };

  const callFaker = async (network: StacksTestnet, mode = PostConditionMode.Deny) => {
    clearState();
    const args = [
      uintCV(1234),
      intCV(-234),
      bufferCV(Buffer.from('hello, world')),
      stringAsciiCV('hey-ascii'),
      stringUtf8CV('hey-utf8'),
      standardPrincipalCV('ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3'),
      trueCV(),
    ];
    const postConditions = [
      makeStandardSTXPostCondition(
        address || '',
        FungibleConditionCode.LessEqual,
        new BN('100', 10)
      ),
    ];
    await doContractCall({
      network,
      contractAddress: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
      contractName: 'faker',
      functionName: 'rawr',
      functionArgs: args,
      attachment: 'This is an attachment',
      postConditionMode: mode,
      postConditions,
      onFinish: data => {
        console.log('finished faker!', data);
        console.log(data.stacksTransaction.auth.spendingCondition?.nonce.toNumber());
        setState('Contract Call', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const stxTransfer = async (amount: string) => {
    clearState();
    await doSTXTransfer({
      network,
      amount,
      memo: 'From demo app',
      recipient: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
      onFinish: data => {
        console.log('finished stx transfer!', data);
        setState('Stacks Transfer', data?.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const deployContract = async () => {
    clearState();
    await doContractDeploy({
      network,
      contractName: `demo-deploy-${new Date().getTime().toString()}`,
      codeBody: demoTokenContract,
      onFinish: data => {
        console.log('finished stx transfer!', data);
        setState('Contract Deploy', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const callNullContract = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
      contractName: `connect-token-${new Date().getTime()}`,
      functionName: 'faucet',
      functionArgs: [],
    });
  };

  const getRocketTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
      contractName: 'dull-sapphire-bird',
      functionName: 'buy',
      functionArgs: [uintCV(42)],
      postConditions: [
        makeStandardSTXPostCondition(address || '', FungibleConditionCode.Equal, new BN(42, 10)),
      ],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const getStellaFaucetTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractName: 'stella-the-cat',
      functionName: 'faucet',
      functionArgs: [],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const sendStellaTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
      contractName: 'stella-the-cat',
      functionName: 'transfer',
      functionArgs: [
        uintCV(1), // amount
        standardPrincipalCV(address || ''), // sender
        standardPrincipalCV('ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3'), // recipient
        someCV(bufferCVFromString('meow')), // memo
      ],
      postConditions: [
        makeStandardFungiblePostCondition(
          address || '',
          FungibleConditionCode.Equal,
          new BN(1),
          createAssetInfo(
            'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
            'stella-the-cat',
            'stella-token'
          )
        ),
      ],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };
  const sendRocketTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
      contractName: 'dull-sapphire-bird',
      functionName: 'transfer',
      functionArgs: [
        uintCV(1), // amount
        standardPrincipalCV(address || ''), // sender
        standardPrincipalCV('ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3'), // recipient
      ],
      postConditions: [
        makeStandardFungiblePostCondition(
          address || '',
          FungibleConditionCode.Equal,
          new BN(1),
          createAssetInfo(
            'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
            'dull-sapphire-bird',
            'rocket-token'
          )
        ),
      ],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Debugger
      </Text>
      <Text textStyle="body.large" display="block" my={'base'}>
        Try out a bunch of different transactions on the Stacks blockchain testnet.
      </Text>
      {txId && (
        <Text textStyle="body.large" display="block" my={'base'}>
          <Text color="green" fontSize={1}>
            Successfully broadcasted &quot;{txType}&quot;
          </Text>
          <ExplorerLink txId={txId} />
        </Text>
      )}

      <Box>
        <ButtonGroup spacing={4} my="base">
          <Button
            data-testid={TransactionSigningSelectors.BtnContractCall}
            mt={3}
            onClick={() => callFaker(stacksTestnetNetwork, PostConditionMode.Allow)}
          >
            Contract call (ALLOW mode)
          </Button>
          <Button
            data-testid={TransactionSigningSelectors.BtnContractCall}
            mt={3}
            onClick={() => callFaker(stacksTestnetNetwork)}
          >
            Contract call (Testnet)
          </Button>
          <Button
            data-testid={TransactionSigningSelectors.BtnContractCall}
            mt={3}
            onClick={() => callFaker(stacksRegtestNetwork)}
          >
            Contract call (Regtest)
          </Button>
          <Button
            data-testid={TransactionSigningSelectors.BtnContractCall}
            mt={3}
            onClick={() => callFaker(stacksLocalhostNetwork)}
          >
            Contract call (Localhost)
          </Button>
          <Button mt={3} onClick={() => stxTransfer('102')}>
            STX transfer
          </Button>
          <Button mt={3} onClick={callBnsTransfer}>
            NFT with postconditions (will fail)
          </Button>
          <Button mt={3} onClick={callAnimalTransfer}>
            transfer Animal NFT
          </Button>
          <Button mt={3} onClick={deployContract}>
            Contract deploy
          </Button>
          <Button mt={3} onClick={getStellaFaucetTokens}>
            Get SteLLa tokens (sip 10 with memo)
          </Button>
          <Button mt={3} onClick={sendStellaTokens}>
            Send SteLLa tokens
          </Button>
          <Button mt={3} onClick={getRocketTokens}>
            Get Rocket tokens (old sip 10 no memo)
          </Button>
          <Button mt={3} onClick={sendRocketTokens}>
            Send Rocket tokens
          </Button>
          <Button mt={3} onClick={callNullContract}>
            Non-existent contract
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
