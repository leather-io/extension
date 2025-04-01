import type { MarketData, Money } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';

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
      {({ fees, isLoading, getCustomFee }) => {
        return (
          <FeeEditorProvider
            availableBalance={availableBalance}
            fees={fees}
            feeType="fee-rate"
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
