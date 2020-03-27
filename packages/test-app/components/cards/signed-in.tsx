import React, { useContext } from 'react';
import { Card } from '@cards/card';
import { Button, Box, Text, Flex } from '@blockstack/ui';
import { AppContext } from '@common/context';

interface SignOutProps {
  signOut: () => void;
}

export const SignedIn: React.FC<SignOutProps> = ({ signOut }) => {
  const state = useContext(AppContext);

  return (
    <Card title="Welcome Back!">
      <Box pt={4}>
        <Text as="h2">{state.userData?.username}</Text>
      </Box>
      <Flex mt={6}>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </Button>
      </Flex>
    </Card>
  );
};
