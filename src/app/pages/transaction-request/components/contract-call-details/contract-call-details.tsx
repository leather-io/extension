import { Suspense } from 'react';
import { Stack, color } from '@stacks/ui';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { Divider } from '@app/components/divider';
import { Title } from '@app/components/typography';
import { ContractPreviewLayout } from '@app/pages/transaction-request/components/contract-preview';
import { AttachmentRow } from '@app/pages/transaction-request/components/attachment-row';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

import { FunctionArgumentsList } from './function-arguments-list';
import { formatContractId } from '@app/common/utils';

function ContractCallDetailsSuspense() {
  const transactionRequest = useTransactionRequestState();
  const { handleOpenTxLink } = useExplorerLink();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') return null;
  const { contractAddress, contractName, functionName, attachment } = transactionRequest;

  return (
    <Stack
      spacing="loose"
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      py="extra-loose"
      px="base-loose"
    >
      <Title as="h2" fontWeight="500">
        Function and arguments
      </Title>

      <ContractPreviewLayout
        onClick={() => handleOpenTxLink(formatContractId(contractAddress, contractName))}
        contractAddress={contractAddress}
        contractName={contractName}
        functionName={functionName}
      />
      <Stack divider={<Divider />} spacing="base">
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
