import SBtcAvatarIconSrc from '@assets/avatars/sbtc-avatar-icon.png';

import { Avatar, Caption, Title } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import type { SBtcDepositInfo } from '@app/query/sbtc/sbtc-deposits.query';

import { TransactionItemLayout } from '../transaction-item/transaction-item.layout';

interface SBtcDepositTransactionItemProps {
  deposit: SBtcDepositInfo;
}
export function SBtcDepositTransactionItem({ deposit }: SBtcDepositTransactionItemProps) {
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();

  const openTxLink = () => {
    void analytics.track('view_bitcoin_transaction');
    handleOpenTxLink({ txid: deposit.bitcoinTxid });
  };

  return (
    <TransactionItemLayout
      openTxLink={openTxLink}
      txCaption={truncateMiddle(deposit.bitcoinTxid, 4)}
      txIcon={
        // Replace with sBTC avatar icon
        <Avatar.Root>
          <Avatar.Image alt="ST" src={SBtcAvatarIconSrc} />
        </Avatar.Root>
      }
      txStatus={<Caption color="yellow.action-primary-default">Pending</Caption>}
      txTitle={<Title textStyle="label.02">BTC → sBTC</Title>}
      // Api is only returning 0 right now
      txValue={''} // deposit.amount.toString()
    />
  );
}
