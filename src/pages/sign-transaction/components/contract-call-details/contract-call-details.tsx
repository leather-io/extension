import React, { Suspense } from 'react';
import { Stack, color } from '@stacks/ui';

import { useExplorerLink } from '@common/hooks/use-explorer-link';
import { Divider } from '@components/divider';
import { Title } from '@components/typography';
import { ContractPreview } from '@pages/sign-transaction/components/contract-preview';
import { AttachmentRow } from '@pages/sign-transaction/components/attachment-row';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';

import { FunctionArgumentsList } from './function-arguments-list';

function ContractCallDetailsSuspense(): JSX.Element | null {
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

      <ContractPreview
        onClick={() => handleOpenTxLink(`${contractAddress}.${contractName}`)}
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

export function ContractCallDetails(): JSX.Element {
  return (
    <Suspense fallback={<></>}>
      <ContractCallDetailsSuspense />
    </Suspense>
  );
}
