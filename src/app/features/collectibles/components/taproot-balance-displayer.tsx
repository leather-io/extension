import { formatMoney } from '@app/common/money/format-money';
import { useCurrentTaprootAccountBalance } from '@app/query/bitcoin/balance/btc-taproot-balance.hooks';
import { useRecoverUninscribedTaprootUtxosFeatureEnabled } from '@app/query/common/remote-config/remote-config.query';
import { Link } from '@app/ui/components/link/link';
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
    <BasicTooltip label={taprootSpendNotSupportedYetMsg}>
      <Link onClick={() => onSelectRetrieveBalance()} textStyle="caption.02" variant="text">
        {formatMoney(balance)}
      </Link>
    </BasicTooltip>
  );
}
