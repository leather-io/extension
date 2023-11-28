import { formatMoney } from '@app/common/money/format-money';
import { Tooltip } from '@app/components/tooltip';
import { useCurrentTaprootAccountBalance } from '@app/query/bitcoin/balance/btc-taproot-balance.hooks';
import { LeatherButton } from '@app/ui/components/button';

const taprootSpendNotSupportedYetMsg = `
  Total amount of BTC in your Taproot account addresses. Click to
  retrieve these funds.
`;

interface TaprootBalanceDisplayerProps {
  onSelectRetrieveBalance(): void;
}
export function TaprootBalanceDisplayer({ onSelectRetrieveBalance }: TaprootBalanceDisplayerProps) {
  const balance = useCurrentTaprootAccountBalance();
  if (balance.amount.isLessThanOrEqualTo(0)) return null;
  return (
    <Tooltip label={taprootSpendNotSupportedYetMsg}>
      <LeatherButton
        onClick={() => onSelectRetrieveBalance()}
        textStyle="caption.02"
        variant="text"
      >
        {formatMoney(balance)}
      </LeatherButton>
    </Tooltip>
  );
}
