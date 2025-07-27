import type { CryptoCurrency, MarketData } from '@leather.io/models';
import { ItemLayout } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, capitalize, createMoney } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';

import type { Fee } from '../fee-editor.context';
import { FeeItemIcon } from './fee-item-icon';

const feeSymbolToFractionalUnitMap: Record<CryptoCurrency, string> = {
  BTC: 'sats',
  STX: 'uSTX',
};

interface FeeRateItemLayoutProps {
  fee: Fee;
  marketData: MarketData;
  showChevron?: boolean;
}
export function FeeRateItemLayout({ fee, marketData, showChevron }: FeeRateItemLayoutProps) {
  const { priority, feeRate, txFee, time } = fee;

  return (
    <ItemLayout
      img={<FeeItemIcon priority={fee.priority} />}
      showChevron={showChevron}
      titleLeft={capitalize(priority)}
      captionLeft={time}
      titleRight={txFee ? formatCurrency(txFee, { preset: 'pad-decimals' }) : 'N/A'}
      captionRight={
        txFee
          ? `${feeRate} ${feeSymbolToFractionalUnitMap[txFee.symbol]}/vB · ${formatCurrency(
              baseCurrencyAmountInQuote(
                createMoney(Math.ceil(txFee.amount.toNumber()), txFee.symbol),
                marketData
              )
            )}`
          : null
      }
    />
  );
}
