import { Link } from '@leather.io/ui';
import { formatMoney } from '@leather.io/utils';

import { useCurrentTaprootAccountBalance } from '@app/query/bitcoin/ordinals/inscriptions/inscriptions.query';
import { useRecoverUninscribedTaprootUtxosFeatureEnabled } from '@app/query/common/remote-config/remote-config.query';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const taprootSpendNotSupportedYetMsg = `
  Total amount of BTC in your Taproot account addresses. Click to
  retrieve these funds.
`;

interface TaprootBalanceDisplayerProps {
  onSelectRetrieveBalance(): void;
}
export function TaprootBalanceDisplayer({ onSelectRetrieveBalance }: TaprootBalanceDisplayerProps) {
  const balance = useCurrentTaprootAccountBalance();
  const isRecoverFeatureEnabled = useRecoverUninscribedTaprootUtxosFeatureEnabled();
  if (!isRecoverFeatureEnabled) return null;
  if (balance.amount.isLessThanOrEqualTo(0)) return null;
  return (
    <BasicTooltip label={taprootSpendNotSupportedYetMsg} asChild>
      <Link onClick={() => onSelectRetrieveBalance()} textStyle="caption.01" variant="text">
        {formatMoney(balance)}
      </Link>
    </BasicTooltip>
  );
}
