import type { MarketData } from '@leather.io/models';
import { ItemLayout } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, capitalize, createMoney } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';

import type { Fee } from '../fee-editor.context';
import { FeeItemIcon } from './fee-item-icon';

interface FeeValueItemLayoutProps {
  fee: Fee;
  marketData: MarketData;
  showChevron?: boolean;
}
export function FeeValueItemLayout({ fee, marketData, showChevron }: FeeValueItemLayoutProps) {
  const { priority, txFee, time } = fee;

  return (
    <ItemLayout
      img={<FeeItemIcon priority={fee.priority} />}
      showChevron={showChevron}
      titleLeft={capitalize(priority)}
      captionLeft={time}
      titleRight={txFee ? formatCurrency(txFee) : 'N/A'}
      captionRight={
        txFee
          ? `${formatCurrency(
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
