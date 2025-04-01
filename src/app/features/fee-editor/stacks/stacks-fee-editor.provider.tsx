import type { MarketData, Money } from '@leather.io/models';
import type { StacksUnsignedTransactionOptions } from '@leather.io/stacks';

import type { HasChildren } from '@app/common/has-children';

import { FeeEditorProvider } from '../fee-editor.provider';
import { StacksFeesLoader } from './stacks-fees-loader';

interface StacksFeeEditorProviderProps extends HasChildren {
  availableBalance: Money;
  marketData: MarketData;
  onGoBack(): void;
  txOptions: StacksUnsignedTransactionOptions;
}
export function StacksFeeEditorProvider({
  availableBalance,
  children,
  marketData,
  onGoBack,
  txOptions,
}: StacksFeeEditorProviderProps) {
  return (
    <StacksFeesLoader txOptions={txOptions}>
      {({ fees, isLoading, getCustomFee }) => {
        return (
          <FeeEditorProvider
            availableBalance={availableBalance}
            fees={fees}
            feeType="fee-value"
            getCustomFee={getCustomFee}
            isLoadingFees={isLoading}
            marketData={marketData}
            onGoBack={onGoBack}
          >
            {children}
          </FeeEditorProvider>
        );
      }}
    </StacksFeesLoader>
  );
}
