import React from 'react';
import { Card } from '@cards/card';
import { Button, Text } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect';
import { getAuthOrigin } from '@common/utils';

export const HelloContractCard: React.FC = () => {
  const { doContractCall } = useConnect();
  const authOrigin = getAuthOrigin();

  return (
    <Card title="Hello Clarity">
      <Text display="inline-block">Invoke a clarity function that simply returns &quot;Hello, World&quot;</Text>
      <Button
        mt={3}
        onClick={async () =>
          await doContractCall({
            authOrigin,
            contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
            functionName: 'say-hi',
            contractName: 'stream',
            functionArgs: [],
          })
        }
      >
        Say Hello
      </Button>
    </Card>
  );
};
