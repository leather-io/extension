import { useAsync } from 'react-async-hook';

import { type ContractCallPayload, addressToString, fetchAbi } from '@stacks/transactions';
import { Stack, styled } from 'leather-styles/jsx';

import { logger } from '@shared/logger';

import { FunctionArgumentList } from './function-argument-list';

export function ContractCallDetails({ payload }: { payload: ContractCallPayload }) {
  const contractAddress = addressToString(payload.contractAddress);
  const contractName = payload.contractName.content;
  const functionName = payload.functionName.content;

  const contractAbi = useAsync(async () => {
    try {
      return await fetchAbi({ contractAddress, contractName });
    } catch (error) {
      logger.error(`Failed to fetch contract ABI for ${contractAddress}.${contractName}`, error);
      return;
    }
  }, []).result;

  if (!contractAbi) {
    logger.error(`Attempting to call an invalid contract: ${contractAddress}.${contractName}`);
    return (
      <styled.span textStyle="caption.01" color="red.action-primary-default">
        Not a valid contract
      </styled.span>
    );
  }

  const contractFunction = contractAbi.functions.find(fn => fn.name === functionName);

  if (!contractFunction) {
    logger.error(
      `Attempting to call a function (\`${functionName}\`) that ` +
        `does not exist on contract ${contractAddress}.${contractName}`
    );
    return (
      <styled.span textStyle="caption.01" color="red.action-primary-default">
        Function not found
      </styled.span>
    );
  }

  return (
    <Stack gap="space.04">
      <FunctionArgumentList fn={contractFunction} fnArgs={payload.functionArgs} />
    </Stack>
  );
}
