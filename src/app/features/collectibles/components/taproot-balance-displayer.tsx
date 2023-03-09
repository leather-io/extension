import { formatMoney } from '@app/common/money/format-money';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { useCurrentTaprootAccountBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';

const taprootSpendNotSupportedYetMsg = `
  Total amount of BTC in your Taproot account addresses. You'll soon be able
  to retrieve these funds to your spendable Native SegWit account. Learn more ↗
`;

export function TaprootBalanceDisplayer() {
  const balance = useCurrentTaprootAccountBalance();
  if (balance.amount.isLessThanOrEqualTo(0)) return null;
  return (
    <Tooltip label={taprootSpendNotSupportedYetMsg}>
      <Caption
        as="button"
        onClick={() => openInNewTab('https://twitter.com/hirowallet/status/1633466927682322436')}
      >
        {formatMoney(balance)}
      </Caption>
    </Tooltip>
  );
}
