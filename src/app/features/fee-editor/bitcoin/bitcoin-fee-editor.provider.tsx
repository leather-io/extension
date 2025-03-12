import type { MarketData, Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';
import { isUndefined } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import type { HasChildren } from '@app/common/has-children';

import { FeeEditorProvider } from '../fee-editor.provider';
import { BitcoinFeesLoader } from './bitcoin-fees-loader';

interface BitcoinFeeEditorProviderProps extends HasChildren {
  amount: Money;
  availableBalance: Money;
  isSendingMax?: boolean;
  marketData: MarketData;
  onGoBack(): void;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function BitcoinFeeEditorProvider({
  amount,
  availableBalance,
  children,
  isSendingMax,
  marketData,
  onGoBack,
  recipients,
  utxos,
}: BitcoinFeeEditorProviderProps) {
  return (
    <BitcoinFeesLoader
      amount={amount}
      isSendingMax={isSendingMax}
      recipients={recipients}
      utxos={utxos}
    >
      {(fees, isLoading, getCustomFee) => {
        if (isUndefined(fees)) return null;
        return (
          <FeeEditorProvider
            availableBalance={availableBalance}
            fees={fees}
            getCustomFee={getCustomFee}
            isLoadingFees={isLoading}
            marketData={marketData}
            onGoBack={onGoBack}
          >
            {children}
          </FeeEditorProvider>
        );
      }}
    </BitcoinFeesLoader>
  );
}
