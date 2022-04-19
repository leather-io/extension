import React, { useContext, useState } from 'react';
import { AppContext } from '@common/context';
import { Box, Text, Flex, BoxProps, Button } from '@stacks/ui';
import { JwtAuth } from './auth';
import { Tab } from './tab';
import { Status } from './status';
import { Counter } from './counter';
import { Debugger } from './debugger';
import { Bns } from './bns';
import { Signature } from './signature';
import { getStacksProvider } from '@stacks/connect';
import { useConnect } from '@stacks/connect-react';

import { stacksTestnetNetwork as network } from '@common/utils';
import { getAddressFromPublicKey } from '@stacks/transactions';
import { TransactionVersion } from '@stacks/common';

type Tabs = 'status' | 'counter' | 'debug' | 'bns' | 'signature';

const Container: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box width="100%" px={6} {...props}>
      <Box maxWidth="900px" mx="auto">
        {children}
      </Box>
    </Box>
  );
};

const Page: React.FC<{ tab: Tabs; setTab: (value: Tabs) => void }> = ({ tab, setTab }) => {
  return (
    <>
      <Container borderColor="#F0F0F5" borderWidth={0} borderBottomWidth="1px">
        <Flex>
          <Tab active={tab === 'debug'}>
            <Text onClick={() => setTab('debug')}>Dubugger</Text>
          </Tab>
          <Tab active={tab === 'status'}>
            <Text onClick={() => setTab('status')}>Status smart contract</Text>
          </Tab>
          <Tab active={tab === 'counter'}>
            <Text onClick={() => setTab('counter')}>Counter smart contract</Text>
          </Tab>
          <Tab active={tab === 'bns'}>
            <Text onClick={() => setTab('bns')}>BNS</Text>
          </Tab>
          <Tab active={tab === 'signature'}>
            <Text onClick={() => setTab('signature')}>Signature</Text>
          </Tab>
        </Flex>
      </Container>
      <Container>
        {tab === 'status' && <Status />}
        {tab === 'counter' && <Counter />}
        {tab === 'debug' && <Debugger />}
        {tab === 'bns' && <Bns />}
        {tab === 'signature' && <Signature />}
      </Container>
    </>
  );
};

export const Home: React.FC = () => {
  const state = useContext(AppContext);
  const [tab, setTab] = useState<Tabs>('debug');
  const [account, setAccount] = useState<any>(null);
  return (
    <Container>
      <Text as="h1" textStyle="display.large" fontSize={7} mb={'loose'} display="block">
        Testnet Demo
      </Text>
      {state.userData || account ? (
        <Page tab={tab} setTab={setTab} />
      ) : (
        <>
          <JwtAuth />
          <Button
            size="lg"
            my="base"
            onClick={() => {
              // console.log('request accounts app', getStacksProvider());
              getStacksProvider()
                .request('stx_requestAccounts')
                .then(resp => {
                  setAccount(resp);
                  console.log('request acct resp', resp);
                });
            }}
          >
            Request accounts
          </Button>
        </>
      )}
      {/* 
        <Button
          my="base"
          ml="base"
          // isDisabled={account === null}
          onClick={() => {
            // getStacksProvider()
            //   .request('stx_signTransactionRequest', [{}])
            //   .then(resp => {
            //     // setAccount(resp);
            //     console.log('transaction req from inpage', resp);
            //   });
            // const stxAddress = getAddressFromPublicKey(
            //   account[0].stxPublicKey,
            //   TransactionVersion.Testnet
            // );
            // console.log({ stxAddress });
            doSTXTransfer({
              network: network as any,
              amount: '100',
              memo: 'From demo app',
              recipient: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
              stxAddress: 'ST17YZQB1228EK9MPHQXA8GC4G3HVWZ66X779FEBY',
              // stxAddress,
              onFinish: data => {
                console.log('finished stx transfer!', data);
              },
              onCancel: () => {
                console.log('popup closed!');
              },
            });
          }}
        >
          Sign transaction
        </Button> */}

      {/* <Button
        my="base"
        ml="base"
        onClick={() => {
          // getStacksProvider()
          //   .request('stx_signTransactionRequest', [{}])
          //   .then(resp => {
          //     // setAccount(resp);
          //     console.log('transaction req from inpage', resp);
          //   });

          // console.log({ stxAddress });
          doSTXTransfer({
            network: network as any,
            amount: '100',
            memo: 'From demo app',
            recipient: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
            stxAddress: 'ST17YZQB1228EK9MPHQXA8GC4G3HVWZ66X779FEBY',
            onFinish: data => {
              console.log('finished stx transfer!', data);
            },
            onCancel: () => {
              console.log('popup closed!');
            },
          });
        }}
      >
        Sign transaction (before `stx_requestAccounts`)
      </Button> */}
      <br />
      {account !== null && <pre>{JSON.stringify(account, null, 2)}</pre>}
    </Container>
  );
};
