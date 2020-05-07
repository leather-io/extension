import React, { useState, useEffect } from 'react';
import {
  Screen,
  ScreenBody,
  ScreenActions,
  Title,
  PoweredBy,
  ScreenFooter,
  ContractCallPayload,
} from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Box, Text } from '@blockstack/ui';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';
import { useWallet } from '@common/hooks/use-wallet';
import { TransactionVersion, AddressVersion, addressToString } from '@blockstack/stacks-transactions';
import { TestnetBanner } from '@components/transactions/testnet-banner';
import { TxError } from '@components/transactions/tx-error';
import { TabbedCard, Tab } from '@components/tabbed-card';
import { finalizeTxSignature } from '@common/utils';
import { encodeContractCallArgument, getRPCClient, stacksValue } from '@common/stacks-utils';

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
  const { wallet } = useWallet();
  const [requestState, setRequestState] = useState<ContractCallPayload | undefined>();
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [contractSrc, setContractSrc] = useState('');
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const client = getRPCClient();

  const getInputJSON = () => {
    if (requestState && wallet) {
      const { appDetails, publicKey, ...rest } = requestState;
      const [identity] = wallet.identities;
      return {
        ...rest,
        'tx-sender': addressToString(identity.getSTXAddress(AddressVersion.TestnetSingleSig)),
      };
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
    },
  ];

  const setupAccountInfo = async () => {
    if (wallet) {
      const [identity] = wallet.identities;
      const account = await client.fetchAccount(
        addressToString(identity.getSTXAddress(AddressVersion.TestnetSingleSig))
      );
      setBalance(account.balance.toNumber());
      setNonce(account.nonce);
    }
  };

  const setupWithState = async (reqState: ContractCallPayload) => {
    const source = await client.fetchContractSource({
      contractName: reqState.contractName,
      contractAddress: reqState.contractAddress,
    });
    if (source) {
      setContractSrc(source);
      setRequestState(reqState);
    } else {
      setError(`Unable to find contract ${reqState.contractName}.${reqState.contractAddress}`);
    }
  };

  const setup = async () => {
    const urlParams = new URLSearchParams(location.search);
    const requestToken = urlParams.get('request');
    if (requestToken && wallet) {
      const token = decodeToken(requestToken);
      const reqState = (token.payload as unknown) as ContractCallPayload;
      await Promise.all([setupWithState(reqState), setupAccountInfo()]);
      setLoading(false);
    } else {
      console.error('Unable to find contract call parameter');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setup();
  }, []);

  const handleButtonClick = async () => {
    if (requestState && wallet) {
      setLoading(true);
      const [identity] = wallet.identities;
      const { contractName, contractAddress, functionName } = requestState;
      const version = TransactionVersion.Testnet;
      const args = requestState.functionArgs.map(arg => {
        return encodeContractCallArgument(arg);
      });
      const rpcClient = getRPCClient();
      const tx = identity.signContractCall({
        contractName,
        contractAddress,
        functionName,
        functionArgs: args,
        version,
        nonce,
      });
      const serialized = tx.serialize().toString('hex');
      setTxHash(serialized);
      const res = await rpcClient.broadcastTX(tx.serialize());
      // const { txId } = await res.json();
      if (res.ok) {
        const txId = await res.text();
        finalizeTxSignature({ txId, txRaw: serialized });
      } else {
        const response = await res.json();
        if (response.error) {
          console.error(response.error);
          console.error(response.reason);
          setError(`${response.error} - ${response.reason}`);
        }
      }
      setLoading(false);
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
              with {requestState?.appDetails?.name}
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
