import React from 'react';
import { Flex, color, space } from '@blockstack/ui';
import { Main } from '@components/main';
import { Header } from '@components/header';

const HomeLayout: React.FC<any> = ({ children }) => {
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Header />
      <Main mx="unset" width={'100%'}>
        {children}
      </Main>
    </Flex>
  );
};

export { HomeLayout };
