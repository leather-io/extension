import React from 'react';

import { SampleContracts } from '@common/contracts';
import { useConnect } from '@stacks/connect-react-jwt';
import { Box, styled } from 'leather-styles/jsx';

import { ExplorerLink } from './explorer-link';

export const Deploy = () => {
  const [tx, setTx] = React.useState('');
  const { doContractDeploy, userSession } = useConnect();
  const handleSubmit = () =>
    doContractDeploy({
      codeBody: SampleContracts[0].contractSource,
      contractName: SampleContracts[0].contractName,
      userSession,
      onFinish: data => {
        setTx(data.txId);
        console.log('finished!', data);
      },
    });
  return (
    <Box mb={6} maxWidth="600px" mt={6}>
      <styled.h2 textStyle="body.02" mt={6}>
        Contract Deploy
      </styled.h2>
      <styled.span display="block" my={4}>
        Deploy a Clarity smart contract. To keep things simple, we'll provide a contract for you.
      </styled.span>
      {tx && <ExplorerLink txId={tx} />}
      <Box mt={4}>
        <styled.button onClick={handleSubmit}>Deploy</styled.button>
      </Box>
    </Box>
  );
};
