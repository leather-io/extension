import React from 'react';
import { space, Box, Text, Button, ButtonGroup } from '@blockstack/ui';
import { getAuthOrigin } from '@common/utils';
import { useConnect } from '@stacks/connect-react';
import {
  StacksTestnet,
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from '@blockstack/stacks-transactions';

export const Debugger = () => {
  const { doContractCall, doSTXTransfer, doContractDeploy } = useConnect();

  const callFaker = async () => {
    const authOrigin = getAuthOrigin();
    const network = new StacksTestnet();
    const args = [
      uintCV(1234),
      intCV(-234),
      bufferCV(Buffer.from('hello, world')),
      stringAsciiCV('hey-ascii'),
      stringUtf8CV('hey-utf8'),
      standardPrincipalCV('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'),
      trueCV(),
    ];
    await doContractCall({
      network,
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: 'faker',
      functionName: 'rawr',
      functionArgs: args,
      finished: data => {
        console.log('finished faker!', data);
      },
    });
  };

  const stxTransfer = async () => {
    const authOrigin = getAuthOrigin();
    const network = new StacksTestnet();
    await doSTXTransfer({
      network,
      authOrigin,
      amount: '102',
      recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      finished: data => {
        console.log('finished stx transfer!', data);
      },
    });
  };

  const deployContract = async () => {
    const authOrigin = getAuthOrigin();
    const network = new StacksTestnet();
    await doContractDeploy({
      network,
      authOrigin,
      contractName: `demo-deploy-${new Date().getTime().toString()}`,
      codeBody: '(print true)',
      finished: data => {
        console.log('finished stx transfer!', data);
      },
    });
  };
  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Debugger
      </Text>
      <Text textStyle="body.large" display="block" my={space('loose')}>
        Random utilities for testing things out.
      </Text>

      <Box>
        <ButtonGroup spacing={4} my={5}>
          <Button mt={3} onClick={callFaker}>
            Contract call
          </Button>
          <Button mt={3} onClick={stxTransfer}>
            STX transfer
          </Button>
          <Button mt={3} onClick={deployContract}>
            Contract deploy
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
