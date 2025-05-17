import { type Money } from '@leather.io/models';
import { type UtxoResponseItem } from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import type { TransferRecipient } from '@shared/models/form.model';

import { useAverageBitcoinFeeRates } from '@app/query/bitcoin/fees/fee-estimates.hooks';

import type { Fee, Fees } from '../fee-editor.context';
import { getBitcoinFee, getBitcoinSendMaxFee } from './bitcoin-fees.utils';
import { useBitcoinFees } from './use-bitcoin-fees';

interface BitcoinFees {
  fees: Fees;
  isLoading: boolean;
  getCustomFee(rate: number): Fee;
}

interface BitcoinFeesLoaderProps {
  amount: Money;
  children({ fees, isLoading, getCustomFee }: BitcoinFees): React.ReactNode;
  isSendingMax?: boolean;
  recipients: TransferRecipient[];
  utxos: UtxoResponseItem[];
}
export function BitcoinFeesLoader({
  amount,
  children,
  isSendingMax,
  recipients,
  utxos,
}: BitcoinFeesLoaderProps) {
  const { data: feeRates, isLoading } = useAverageBitcoinFeeRates();
  const { determineUtxosDefaultArgs, fees } = useBitcoinFees({
    amount,
    feeRates,
    isSendingMax,
    recipients,
    utxos,
  });

  function getCustomFee(feeRate: number): Fee {
    const determineUtxosForFeeArgs = {
      ...determineUtxosDefaultArgs,
      feeRate,
    };
    const fee = isSendingMax
      ? getBitcoinSendMaxFee(determineUtxosForFeeArgs)
      : getBitcoinFee(determineUtxosForFeeArgs);

    return {
      priority: 'custom',
      feeRate,
      txFee: fee ?? createMoney(0, 'BTC'),
      time: '',
    };
  }

  if (!fees) return null;
  return children({ fees, isLoading, getCustomFee });
}
