import React, { useContext, useState } from 'react';

import { AppContext } from '@common/context';
import { Box, BoxProps, Flex, styled } from 'leather-styles/jsx';

import { Auth } from './auth';
import { Bitcoin } from './bitcoin';
import { Bns } from './bns';
import { Counter } from './counter';
import { Debugger } from './debugger';
import { Profile } from './profile';
import { Signature } from './signature';
import { Status } from './status';
import { Tab } from './tab';

type Tabs = 'status' | 'counter' | 'debug' | 'bns' | 'signature' | 'profile' | 'bitcoin';

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
            <styled.span onClick={() => setTab('debug')}>Debugger</styled.span>
          </Tab>
          <Tab active={tab === 'status'}>
            <styled.span onClick={() => setTab('status')}>Status smart contract</styled.span>
          </Tab>
          <Tab active={tab === 'counter'}>
            <styled.span onClick={() => setTab('counter')}>Counter smart contract</styled.span>
          </Tab>
          <Tab active={tab === 'bns'}>
            <styled.span onClick={() => setTab('bns')}>BNS</styled.span>
          </Tab>
          <Tab active={tab === 'signature'}>
            <styled.span onClick={() => setTab('signature')}>Signature</styled.span>
          </Tab>
          <Tab active={tab === 'profile'}>
            <styled.span onClick={() => setTab('profile')}>Profile</styled.span>
          </Tab>
          <Tab active={tab === 'bitcoin'}>
            <styled.span onClick={() => setTab('bitcoin')}>Bitcoin</styled.span>
          </Tab>
        </Flex>
      </Container>
      <Container>
        {tab === 'status' && <Status />}
        {tab === 'counter' && <Counter />}
        {tab === 'debug' && <Debugger />}
        {tab === 'bns' && <Bns />}
        {tab === 'signature' && <Signature />}
        {tab === 'profile' && <Profile />}
        {tab === 'bitcoin' && <Bitcoin />}
      </Container>
    </>
  );
};

export const Home: React.FC = () => {
  const state = useContext(AppContext);
  const [tab, setTab] = useState<Tabs>('debug');

  return (
    <Container>
      <styled.h1 textStyle="heading.01" mb="space.05" display="block">
        Testnet Demo
      </styled.h1>
      {state.userData ? <Page tab={tab} setTab={setTab} /> : <Auth />}
    </Container>
  );
};
