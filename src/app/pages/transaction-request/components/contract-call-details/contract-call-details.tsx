import { Suspense } from 'react';

import { Stack } from 'leather-styles/jsx';
import { divider } from 'leather-styles/patterns';
import { token } from 'leather-styles/tokens';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { formatContractId } from '@app/common/utils';
import { Title } from '@app/components/typography';
import { AttachmentRow } from '@app/pages/transaction-request/components/attachment-row';
import { ContractPreviewLayout } from '@app/pages/transaction-request/components/contract-preview';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

import { FunctionArgumentsList } from './function-arguments-list';

function ContractCallDetailsSuspense() {
  const transactionRequest = useTransactionRequestState();
  const { handleOpenTxLink } = useExplorerLink();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') return null;
  const { contractAddress, contractName, functionName, attachment } = transactionRequest;

  return (
    <Stack
      border="4px solid"
      borderColor={token('colors.accent.border-default')}
      borderRadius="12px"
      mb="space.05"
      px="base-loose"
      py="space.06"
      gap="space.05"
      width="100%"
    >
      <Title as="h2" fontWeight="500">
        Function and arguments
      </Title>

      <ContractPreviewLayout
        onClick={() =>
          handleOpenTxLink({
            blockchain: 'stacks',
            txid: formatContractId(contractAddress, contractName),
          })
        }
        contractAddress={contractAddress}
        contractName={contractName}
        functionName={functionName}
      />
      {/* TODO - make sure this looks OK then come up with a better way of sharing this logic - new component <DividedStack  */}
      <Stack
        gap="space.04"
        className={divider({
          orientation: 'horizontal',
          thickness: '1px',
          color: token('colors.accent.border-default'),
        })}
      >
        <FunctionArgumentsList />
        {attachment && <AttachmentRow />}
      </Stack>
    </Stack>
  );
}

export function ContractCallDetails() {
  return (
    <Suspense fallback={<></>}>
      <ContractCallDetailsSuspense />
    </Suspense>
  );
}
