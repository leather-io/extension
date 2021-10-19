import React, { memo } from 'react';

import { useContractFunction } from '@query/contract/contract.hooks';
import { useExplorerLink } from '@common/hooks/use-explorer-link';
import { Divider } from '@components/divider';
import { hexToBuff } from '@common/utils';
import { Caption, Title } from '@components/typography';
import { ContractPreview } from '@pages/transaction-signing/components/contract-preview';
import { AttachmentRow } from '@pages/transaction-signing/components/attachment-row';
import { RowItem } from '@pages/transaction-signing/components/row-item';
import { Stack, color, StackProps } from '@stacks/ui';
import { deserializeCV, cvToString, getCVTypeString } from '@stacks/transactions';
import { useTransactionRequestState } from '@store/transactions/requests.hooks';

interface ArgumentProps {
  arg: string;
  index: number;
}

const FunctionArgumentName = ({ index }: { index: number }) => {
  const contractFunction = useContractFunction();
  return <>{contractFunction?.args[index].name || 'unknown'}</>;
};

const FunctionArgumentRow: React.FC<ArgumentProps> = ({ arg, index, ...rest }) => {
  const argCV = deserializeCV(hexToBuff(arg));
  const strValue = cvToString(argCV);

  return (
    <RowItem
      name={<FunctionArgumentName index={index} />}
      type={getCVTypeString(argCV)}
      value={strValue}
      {...rest}
    />
  );
};

const FunctionArgumentsList = memo((props: StackProps) => {
  const transactionRequest = useTransactionRequestState();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') {
    return null;
  }
  const hasArgs = transactionRequest.functionArgs.length > 0;

  return (
    <>
      {hasArgs ? (
        <Stack divider={<Divider />} spacing="base" {...props}>
          {transactionRequest.functionArgs.map((arg, index) => {
            return (
              <React.Suspense fallback={<>loading</>} key={`${arg}-${index}`}>
                <FunctionArgumentRow arg={arg} index={index} />
              </React.Suspense>
            );
          })}
        </Stack>
      ) : (
        <Caption>There are no additional arguments passed for this function call.</Caption>
      )}
    </>
  );
});

const ContractCallDetailsSuspense = () => {
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
};

export const ContractCallDetails = () => (
  <React.Suspense fallback={<></>}>
    <ContractCallDetailsSuspense />
  </React.Suspense>
);
