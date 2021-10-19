import React from 'react';

import { LoadingRectangle } from '@components/loading-rectangle';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { HighFeeWarning } from '@pages/transaction-signing/components/fee-row/high-fee-warning';
import { Fee } from '@pages/transaction-signing/components/fee-row/fee';
import { Flex } from '@stacks/ui';
import { useCurrentDefaultFee } from '@store/transactions/fees.hooks';
import {
  useTransactionRequestCustomFee,
  useTransactionRequestState,
} from '@store/transactions/requests.hooks';

const FeeRowSuspense = () => {
  let showWarning = false;
  const defaultFee = useCurrentDefaultFee();
  const customFee = useTransactionRequestCustomFee();
  const transactionRequest = useTransactionRequestState();
  const appName = transactionRequest?.appDetails?.name;
  const multipleFromWhichFeeIsConsideredLarge = 4;

  if (!!customFee && defaultFee) {
    showWarning = customFee.isGreaterThan(defaultFee.times(multipleFromWhichFeeIsConsideredLarge));
  }

  return (
    <SpaceBetween>
      <Caption>
        <Flex>
          Fees
          {showWarning && <HighFeeWarning appName={appName} />}
        </Flex>
      </Caption>
      <Caption>
        <Fee />
      </Caption>
    </SpaceBetween>
  );
};

const FeeRowFallback = () => {
  return (
    <SpaceBetween>
      <Caption>Fees</Caption>
      <LoadingRectangle width="50px" height="10px" />
    </SpaceBetween>
  );
};

export const FeeRow = () => {
  return (
    <React.Suspense fallback={<FeeRowFallback />}>
      <FeeRowSuspense />
    </React.Suspense>
  );
};
