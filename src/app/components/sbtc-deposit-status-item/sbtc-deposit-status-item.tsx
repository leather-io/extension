import SbtcAvatarIconSrc from '@assets/avatars/sbtc-avatar-icon.png';

import { Avatar, Caption, Title } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

import { analytics } from '@shared/utils/analytics';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import type { SbtcDepositInfo, SbtcStatus } from '@app/query/sbtc/sbtc-deposits.query';

import { TransactionItemLayout } from '../transaction-item/transaction-item.layout';

function getDepositStatus(status: SbtcStatus) {
  switch (status) {
    case 'pending':
    case 'reprocessing':
      return 'Pending deposit';
    case 'accepted':
      return 'Pending mint';
    case 'confirmed':
      return 'Done';
    case 'failed':
      return 'Failed';
    default:
      return '';
  }
}

interface SbtcDepositTransactionItemProps {
  deposit: SbtcDepositInfo;
}
export function SbtcDepositTransactionItem({ deposit }: SbtcDepositTransactionItemProps) {
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
        <Avatar.Root>
          <Avatar.Image alt="ST" src={SbtcAvatarIconSrc} />
        </Avatar.Root>
      }
      txStatus={
        <Caption color="yellow.action-primary-default">{getDepositStatus(deposit.status)}</Caption>
      }
      txTitle={<Title textStyle="label.02">BTC → sBTC</Title>}
      // Api is only returning 0 right now
      txValue={''} // deposit.amount.toString()
    />
  );
}
