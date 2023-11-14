import { Suspense } from 'react';

import { Stack } from 'leather-styles/jsx';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { formatContractId } from '@app/common/utils';
import { AttachmentRow } from '@app/features/stacks-transaction-request/attachment-row';
import { ContractPreviewLayout } from '@app/features/stacks-transaction-request/contract-preview';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { Title } from '@app/ui/components/typography/title';

import { FunctionArgumentsList } from './function-arguments-list';

function ContractCallDetailsSuspense() {
  const transactionRequest = useTransactionRequestState();
  const { handleOpenTxLink } = useExplorerLink();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') return null;
  const { contractAddress, contractName, functionName, attachment } = transactionRequest;

  return (
    <Stack
      border="4px solid"
      borderColor="accent.background-primary"
      borderRadius="12px"
      mb="space.05"
      px="space.04"
      py="32px"
      gap="space.05"
      width="100%"
    >
      <Title>Function and arguments</Title>

      <ContractPreviewLayout
        onClick={() =>
          handleOpenTxLink({
            blockchain: 'stacks',
            txId: formatContractId(contractAddress, contractName),
          })
        }
        contractAddress={contractAddress}
        contractName={contractName}
        functionName={functionName}
      />
      <Stack gap="space.04">
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
