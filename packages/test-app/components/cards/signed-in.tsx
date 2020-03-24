import React from 'react';
import { Card } from '@cards/card';
import { Button, Box, Text, Flex } from '@blockstack/ui';

export const SignedIn = (props: { username: string; handleSignOut: () => void }) => {
  return (
    <Card title="Welcome Back!">
      <Box textAlign="center" pt={4}>
        <Text as="h2">{props.username}</Text>
      </Box>
      <Flex mt={6} align="center" justify="center">
        <Button mx="auto" onClick={props.handleSignOut}>
          Sign out
        </Button>
      </Flex>
    </Card>
  );
};
