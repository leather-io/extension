import React from 'react';
import { Card } from '@cards/card';
import { Button } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect';
import { getAuthOrigin } from '@common/utils';

export const HelloContractCard: React.FC = () => {
  const { doContractCall } = useConnect();
  const authOrigin = getAuthOrigin();

  return (
    <Card title="Hello Clarity">
      <Button
        onClick={async () =>
          await doContractCall({
            authOrigin,
            contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
            functionName: 'say-hi',
            contractName: 'stream',
          })
        }
      >
        Say Hello
      </Button>
    </Card>
  );
};
