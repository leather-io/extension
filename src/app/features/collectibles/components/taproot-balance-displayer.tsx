import { formatMoney } from '@app/common/money/format-money';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { useCurrentTaprootAccountBalance } from '@app/query/bitcoin/balance/btc-taproot-balance.hooks';

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
      <Caption
        as="button"
        onClick={() => onSelectRetrieveBalance()}
        _hover={{ textDecoration: 'underline' }}
      >
        {formatMoney(balance)}
      </Caption>
    </Tooltip>
  );
}
