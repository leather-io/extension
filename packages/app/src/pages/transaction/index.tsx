import React, { useState, useEffect } from 'react';
import {
  Screen,
  ScreenBody,
  ScreenActions,
  Title,
  PoweredBy,
  ScreenFooter,
  ContractCallPayload,
  ContractDeployPayload,
  TransactionPayload,
} from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Box, Text } from '@blockstack/ui';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';
import { useWallet } from '@common/hooks/use-wallet';
import {
  TransactionVersion,
  AddressVersion,
  addressToString,
  StacksTransaction,
} from '@blockstack/stacks-transactions';
import { TestnetBanner } from '@components/transactions/testnet-banner';
import { TxError } from '@components/transactions/tx-error';
import { TabbedCard, Tab } from '@components/tabbed-card';
import { finalizeTxSignature } from '@common/utils';
import { encodeContractCallArgument, getRPCClient, stacksValue } from '@common/stacks-utils';
import { Identity } from '@blockstack/keychain';

const broadcastTx = (serializedTx: Buffer) => {
  const rpcClient = getRPCClient();
  return rpcClient.broadcastTX(serializedTx);
};

interface TabContentProps {
  json: any;
}

const getInputJSON = (pendingTransaction: TransactionPayload | undefined, identity: Identity) => {
  if (pendingTransaction && identity) {
    const { appDetails, publicKey, ...rest } = pendingTransaction;
    return {
      ...rest,
      'tx-sender': addressToString(identity.getSTXAddress(AddressVersion.TestnetSingleSig)),
    };
  }
  return {};
};

const TabContent: React.FC<TabContentProps> = ({ json }) => {
  return (
    <Box whiteSpace="pre" overflow="scroll" color="gray" maxHeight="200px">
      {JSON.stringify(json, null, 2)}
    </Box>
  );
};

const Textarea = styled.textarea`
  position: absolute;
  left: -999px;
`;

const generateContractCallTx = (txData: ContractCallPayload, identity: Identity, nonce: number) => {
  const { contractName, contractAddress, functionName, functionArgs } = txData;
  const version = TransactionVersion.Testnet;
  const args = functionArgs.map(arg => {
    return encodeContractCallArgument(arg);
  });

  return identity.signContractCall({
    contractName,
    contractAddress,
    functionName,
    functionArgs: args,
    version,
    nonce,
  });
};

const generateContractDeployTx = (
  txData: ContractDeployPayload,
  identity: Identity,
  nonce: number
) => {
  const { contractName, contractSource } = txData;
  const version = TransactionVersion.Testnet;

  return identity.signContractDeploy({
    contractName,
    contractSource,
    version,
    nonce,
  });
};

export const Transaction: React.FC = () => {
  const location = useLocation();
  const { firstIdentity: identity } = useWallet();
  const [pendingTransaction, setPendingTransaction] = useState<TransactionPayload | undefined>();
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [contractSrc, setContractSrc] = useState('');
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const client = getRPCClient();

  if (!identity) {
    throw new Error('User must be logged in.');
  }

  const tabs: Tab[] = [
    {
      title: 'Inputs',
      content: <TabContent json={getInputJSON(pendingTransaction, identity)} />,
      key: 'inputs',
    },
    {
      title: (
        <>
          View Source
          {/* Add this icon when we can link to the explorer */}
          {/* <ExternalIcon display="inline-block" width="9px" ml={1} /> */}
        </>
      ),
      content: (
        <Box whiteSpace="pre" overflow="scroll" color="gray" maxHeight="200px">
          {contractSrc}
        </Box>
      ),
      key: 'source',
      hide: pendingTransaction?.txType === 'stx-transfer',
    },
  ];

  const setupAccountInfo = async () => {
    if (identity) {
      const account = await client.fetchAccount(
        addressToString(identity.getSTXAddress(AddressVersion.TestnetSingleSig))
      );
      setBalance(account.balance.toNumber());
      setNonce(account.nonce);
    }
  };

  const setupWithState = async (tx: TransactionPayload) => {
    if (tx.txType === 'contract-call') {
      const contractSource = await client.fetchContractSource({
        contractName: tx.contractName,
        contractAddress: tx.contractAddress,
      });
      if (contractSource) {
        setContractSrc(contractSource);
        setPendingTransaction(tx);
      } else {
        setError(`Unable to find contract ${tx.contractAddress}.${tx.contractName}`);
      }
    } else if (tx.txType === 'contract-deploy') {
      console.log(tx);
      setContractSrc(tx.contractSource);
      setPendingTransaction(tx);
    } else if (tx.txType === 'stx-transfer') {
      setPendingTransaction(tx);
    }
  };

  const decodeRequest = async () => {
    const urlParams = new URLSearchParams(location.search);
    const requestToken = urlParams.get('request');
    if (requestToken && identity) {
      const token = decodeToken(requestToken);
      const reqState = (token.payload as unknown) as TransactionPayload;
      await Promise.all([setupWithState(reqState), setupAccountInfo()]);
      setLoading(false);
    } else {
      setError('Unable to decode request');
      console.error('Unable to find contract call parameter');
    }
  };

  useEffect(() => {
    decodeRequest();
  }, []);

  const finishTransaction = async (tx: StacksTransaction) => {
    const txRaw = tx.serialize().toString('hex');

    setTxHash(txRaw);

    const res = await broadcastTx(tx.serialize());

    if (res.ok) {
      const txId = await res.text();
      finalizeTxSignature({ txId, txRaw });
    } else {
      const response = await res.json();
      if (response.error) {
        console.error(response.error);
        console.error(response.reason);
        setError(`${response.error} - ${response.reason}`);
      }
    }
    setLoading(false);
  };

  const handleBroadcastContractCall = async () => {
    if (identity && pendingTransaction && pendingTransaction.txType === 'contract-call') {
      setLoading(true);

      const tx = await generateContractCallTx(pendingTransaction, identity, nonce);
      await finishTransaction(tx);
    }
  };

  const handleBroadcastContractDeploy = async () => {
    if (identity && pendingTransaction && pendingTransaction.txType === 'contract-deploy') {
      setLoading(true);

      const tx = await generateContractDeployTx(pendingTransaction, identity, nonce);
      await finishTransaction(tx);
    }
  };

  const handleSTXTransfer = async () => {
    if (identity && pendingTransaction && pendingTransaction.txType === 'stx-transfer') {
      setLoading(true);
      const { recipient, memo, amount } = pendingTransaction;
      const tx = await identity.signSTXTransfer({
        recipient,
        memo,
        amount,
        nonce,
      });
      await finishTransaction(tx);
    }
  };

  const handleButtonClick = async () => {
    if (pendingTransaction?.txType === 'contract-call') {
      await handleBroadcastContractCall();
    }
    if (pendingTransaction?.txType === 'contract-deploy') {
      await handleBroadcastContractDeploy();
    }
    if (pendingTransaction?.txType === 'stx-transfer') {
      await handleSTXTransfer();
    }
  };

  if (error) {
    return <TxError message={error} />;
  }

  return (
    <>
      <Screen isLoading={loading}>
        {/* TODO: only show testnet banner if in testnet mode */}
        <TestnetBanner />
        <ScreenHeader
          rightContent={
            <Text textStyle="caption.small" color="gray" fontSize={0}>
              {stacksValue(balance)} available
            </Text>
          }
        />
        <ScreenBody
          mt={6}
          body={[
            <Title>Confirm Transaction</Title>,
            <Text mt={2} display="inline-block">
              with {pendingTransaction?.appDetails?.name}
            </Text>,
            <TabbedCard mt={4} mb={4} tabs={tabs} />,
            <Box width="100%" mt={5}>
              <Text fontWeight={600}>
                <Text>Total</Text>
                <Text style={{ float: 'right' }}>0 STX</Text>
              </Text>
            </Box>,
          ]}
        />
        <ScreenActions>
          <Button
            width="100%"
            mt={5}
            size="lg"
            onClick={async () => {
              // event.preventDefault();
              await handleButtonClick();
            }}
          >
            Confirm Transaction
          </Button>
        </ScreenActions>
        <ScreenFooter>
          <PoweredBy />
        </ScreenFooter>
      </Screen>
      <Textarea className="hidden-tx-hash" value={txHash} readOnly />
      {/* <Toast show={copied} text="Copied TX hash to clipboard" /> */}
    </>
  );
};
