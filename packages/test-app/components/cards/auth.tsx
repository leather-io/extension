import React from 'react';
import { Card } from '@cards/card';
import { Button, Stack } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect';

export const AuthCard: React.FC = () => {
  const { doOpenAuth, doAuth } = useConnect();

  return (
    <Card title="Authenticate">
      <Stack>
        <Button onClick={() => doOpenAuth(false)} data-test="sign-up">
          Sign Up
        </Button>
        <Button onClick={() => doOpenAuth(true)} data-test="sign-in">
          Sign In
        </Button>
        <Button onClick={() => doAuth()} data-test="skip-connect">
          Skip Connect
        </Button>
      </Stack>
    </Card>
  );
};
