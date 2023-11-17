import { Suspense, memo } from 'react';

import { Stack, StackProps } from 'leather-styles/jsx';

import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { Caption } from '@app/ui/components/typography/caption';

import { FunctionArgumentItem } from './function-argument-item';

function FunctionArgumentsListBase(props: StackProps): React.JSX.Element | null {
  const transactionRequest = useTransactionRequestState();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') {
    return null;
  }
  const hasArgs = transactionRequest.functionArgs.length > 0;

  return (
    <>
      {hasArgs ? (
        <Stack gap="space.04" {...props}>
          {transactionRequest.functionArgs.map((arg, index) => {
            return (
              <Suspense fallback={<>loading</>} key={`${arg}-${index}`}>
                <FunctionArgumentItem arg={arg} index={index} />
              </Suspense>
            );
          })}
        </Stack>
      ) : (
        <Caption>There are no additional arguments passed for this function call.</Caption>
      )}
    </>
  );
}

export const FunctionArgumentsList = memo(FunctionArgumentsListBase);
