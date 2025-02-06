import React from 'react';

import { IntCV, deserializeCV } from '@blockstack/stacks-transactions';
import { AppContext } from '@common/context';
import { getRPCClient, stacksTestnetNetwork as network } from '@common/utils';
import { ExplorerLink } from '@components/explorer-link';
import { useConnect } from '@stacks/connect-react-jwt';
import { Box, Flex, styled } from 'leather-styles/jsx';

export const CounterActions: React.FC = () => {
  const { userData } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [txId, setTxId] = React.useState('');
  const [counter, setCounter] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');
  const { doContractCall } = useConnect();

  const callMethod = async (method: string) => {
    setError('');
    setLoading(true);
    await doContractCall({
      network,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      functionName: method,
      functionArgs: [],
      contractName: 'counter',
      onFinish: data => {
        setTxId(data.txId);
        console.log('finished!', data);
        setLoading(false);
      },
    });
  };

  const getCounter = async () => {
    const client = getRPCClient();
    setLoading(true);
    setError('');
    try {
      const data = await client.callReadOnly({
        contractName: 'counter',
        contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
        args: [],
        functionName: 'get-counter',
      });
      const cv = deserializeCV(Buffer.from(data.result.slice(2), 'hex')) as IntCV;
      console.log(cv.value);
      setCounter(cv.value.toNumber());
      setLoading(false);
    } catch (error) {
      setError('Unable to get current counter value.');
    }
  };

  return (
    <Box>
      {!userData && (
        <styled.span display="block">
          Log in to change the state of this smart contract.
        </styled.span>
      )}
      <Flex gap={4} my={5}>
        <styled.button mt={3} onClick={() => callMethod('increment')}>
          Increase by 1
        </styled.button>
        <styled.button mt={3} onClick={() => callMethod('decrement')}>
          Decrease by 1
        </styled.button>
        <styled.button mt={3} onClick={getCounter}>
          Get current value
        </styled.button>
      </Flex>
      {error && (
        <styled.span display="block" color="red">
          {error}
        </styled.span>
      )}
      {txId && !loading && <ExplorerLink txId={txId} />}
      {counter !== null && !loading && (
        <styled.span display="block">Current counter value: {counter}</styled.span>
      )}
    </Box>
  );
};
