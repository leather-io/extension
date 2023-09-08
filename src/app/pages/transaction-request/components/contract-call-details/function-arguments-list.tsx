import { Suspense, memo } from 'react';

import { Stack, StackProps } from 'leather-styles/jsx';
import { divider } from 'leather-styles/patterns';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

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
        <Stack
          className={divider({
            orientation: 'horizontal',
            thickness: '1px',
            color: token('colors.accent.border-default'),
          })}
          gap="space.04"
          {...props}
        >
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
