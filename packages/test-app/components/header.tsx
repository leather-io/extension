import React, { useContext } from 'react';
import { Flex, Box, Text } from '@blockstack/ui';
import { BlockstackIcon } from '@blockstack/ui';
import { AppContext } from '@common/context';
import { Link, useConnect } from '@blockstack/connect';

interface HeaderProps {
  signOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ signOut }) => {
  const state = useContext(AppContext);
  const { doOpenAuth } = useConnect();
  return (
    <Flex as="nav" justifyContent="space-between" alignItems="center" height="64px" px={6}>
      <Box verticalAlign="center">
        <BlockstackIcon maxHeight="26px" display="inline-block" ml="-10px" />
        <Text display="inline-block" ml={3}>
          Blockstack Testnet Demo
        </Text>
      </Box>
      {state.userData ? (
        <Box>
          <Text textStyle="caption.medium">{state.userData.username}</Text>
          <Link
            display="inline-block"
            ml={2}
            textStyle="caption"
            color="blue"
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </Link>
        </Box>
      ) : (
        <Box>
          <Link
            display="inline-block"
            mr={2}
            textStyle="caption"
            color="blue"
            onClick={() => {
              doOpenAuth();
            }}
            data-test="sign-up"
          >
            Register
          </Link>
          <Text textStyle="caption">/</Text>
          <Link
            display="inline-block"
            ml={2}
            textStyle="caption"
            color="blue"
            data-test="sign-up"
            onClick={() => {
              doOpenAuth(true);
            }}
          >
            Log in
          </Link>
        </Box>
      )}
    </Flex>
  );
};
