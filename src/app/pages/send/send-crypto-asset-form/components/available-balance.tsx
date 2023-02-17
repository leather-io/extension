import { Money } from '@shared/models/money.model';

import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { Caption } from '@app/components/typography';

export function AvailableBalance(props: { availableBalance: Money }) {
  const { availableBalance } = props;
  return (
    <Caption>
      Balance: {convertAmountToBaseUnit(availableBalance).toFormat()}{' '}
      {availableBalance.symbol.toUpperCase()}
    </Caption>
  );
}
