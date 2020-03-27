import React, { useState, useEffect } from 'react';
import { Screen, ScreenBody, ScreenActions, Title, PoweredBy, ScreenFooter, AuthOptions } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Box, Text, ExternalIcon } from '@blockstack/ui';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';
import { useWallet } from '@common/hooks/use-wallet';
import { makeContractCall, TransactionVersion, BufferCV, StacksTransaction } from '@blockstack/stacks-transactions';
import BN from 'bn.js';
import { TestnetBanner } from '@components/transactions/testnet-banner';
import { TabbedCard, Tab } from '@components/tabbed-card';
import { Toast } from '@components/toast';

interface RequestState {
  contractAddress: string;
  functionName: string;
  contractName: string;
  functionArgs: any[];
  appDetails?: AuthOptions['appDetails'];
  publicKey: string;
}

interface TabContentProps {
  json: any;
}

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

export const Transaction: React.FC = () => {
  const location = useLocation();
  const { identities } = useWallet();
  const [requestState, setRequestState] = useState<RequestState | undefined>();
  const [txHash, setTxHash] = useState('');
  const [tx, setTx] = useState<StacksTransaction | null>(null);
  const [copied, setCopied] = useState(false);

  const getInputJSON = () => {
    if (requestState) {
      const { appDetails, publicKey, ...rest } = requestState;
      return rest;
    }
    return {};
  };

  const tabs: Tab[] = [
    {
      title: 'Inputs',
      content: <TabContent json={getInputJSON()} />,
      key: 'inputs',
    },
    {
      title: 'Outputs',
      content: <TabContent json={tx} />,
      key: 'outputs',
    },
    {
      title: (
        <>
          View Source
          <ExternalIcon display="inline-block" width="9px" ml={1} />
        </>
      ),
      content: <span>src</span>,
      key: 'source',
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const requestToken = urlParams.get('request');
    if (requestToken) {
      const token = decodeToken(requestToken);
      const reqState = (token.payload as unknown) as RequestState;
      setRequestState(reqState);
      console.log(reqState);
      const [identity] = identities;
      const args = reqState.functionArgs.map(arg => {
        return new BufferCV(Buffer.from(arg));
      });
      const tx = makeContractCall(
        reqState.contractAddress,
        reqState.contractName,
        reqState.functionName,
        args,
        new BN(0),
        new BN(0), // TODO: actually track nonce
        (identity.getSTXNode().privateKey as Buffer).toString('hex'),
        TransactionVersion.Testnet
      );
      console.log(tx);
      const serialized = tx.serialize().toString('hex');
      setTxHash(serialized);
      setTx(tx);
      console.log(serialized);
    }
  }, []);

  const handleButtonClick = () => {
    const input: HTMLInputElement = document.querySelector('.hidden-tx-hash') as HTMLInputElement;
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setCopied(true);
    document.getSelection()?.empty();
    setTimeout(() => {
      setCopied(false);
    }, 1600);
  };

  return (
    <>
      <Screen>
        {/* TODO: only show testnet banner if in testnet mode */}
        <TestnetBanner />
        <ScreenHeader
          rightContent={
            <Text textStyle="caption.small" color="gray" fontSize={0}>
              {/* TODO: use RPC API to get balance */}
              100.00 STX available
            </Text>
          }
        />
        <ScreenBody
          mt={6}
          body={[
            <Title>Confirm Transaction</Title>,
            <Text mt={2} display="inline-block">
              with {requestState?.appDetails?.name}
            </Text>,
            <TabbedCard mt={4} mb={4} tabs={tabs} />,
            <Box width="100%" mt={5}>
              <Text fontWeight={600}>
                <Text>Total</Text>
                <Text style={{ float: 'right' }}>{tx?.auth?.spendingCondition?.feeRate?.toString()} STX</Text>
              </Text>
            </Box>,
          ]}
        />
        <ScreenActions>
          <Button
            width="100%"
            mt={5}
            size="lg"
            onClick={() => {
              // event.preventDefault();
              handleButtonClick();
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
      <Toast show={copied} text="Copied TX hash to clipboard" />
    </>
  );
};
