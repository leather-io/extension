import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HStack } from 'leather-styles/jsx';

import type { BitcoinTx } from '@leather.io/models';
import { useInscriptionByOutput } from '@leather.io/query';
import { BtcAvatarIcon, BulletSeparator, Caption } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import {
  containsTaprootInput,
  getBitcoinTxCaption,
  getBitcoinTxValue,
  isBitcoinTxInbound,
} from '@app/common/transactions/bitcoin/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { TransactionTitle } from '@app/components/transaction/transaction-title';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { TransactionActionButton } from '../stacks-transaction-item/transaction-action-button';
import { TransactionItemLayout } from '../transaction-item/transaction-item.layout';
import { BitcoinTransactionIcon } from './bitcoin-transaction-icon';
import { InscriptionIcon } from './bitcoin-transaction-inscription-icon';
import { BitcoinTransactionStatus } from './bitcoin-transaction-status';

interface BitcoinTransactionItemProps {
  transaction: BitcoinTx;
}
export function BitcoinTransactionItem({ transaction }: BitcoinTransactionItemProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: inscriptionData } = useInscriptionByOutput(transaction);

  const bitcoinAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const caption = useMemo(() => getBitcoinTxCaption(transaction), [transaction]);
  const value = useMemo(
    () => getBitcoinTxValue(bitcoinAddress, transaction),
    [bitcoinAddress, transaction]
  );

  if (!transaction) return null;

  const onIncreaseFee = () => {
    navigate(RouteUrls.IncreaseBtcFee, { state: { btcTx: transaction } });
  };

  const openTxLink = () => {
    void analytics.track('view_bitcoin_transaction');
    if (inscriptionData) {
      openInNewTab(inscriptionData.id);
      return;
    }
    handleOpenTxLink({ txid: transaction?.txid || '' });
  };

  const isOriginator = !isBitcoinTxInbound(bitcoinAddress, transaction);
  const isEnabled =
    isOriginator && !transaction.status.confirmed && !containsTaprootInput(transaction);

  const txCaption = (
    <HStack gap="space.02">
      <BulletSeparator>
        <Caption>{caption}</Caption>
        {inscriptionData ? <Caption>{inscriptionData.mimeType}</Caption> : null}
      </BulletSeparator>
    </HStack>
  );

  const title = inscriptionData ? `Ordinal inscription #${inscriptionData.number}` : 'Bitcoin';
  const increaseFeeButton = (
    <TransactionActionButton
      label="Increase fee"
      isEnabled={isEnabled}
      isSelected={pathname === RouteUrls.IncreaseBtcFee}
      onButtonClick={onIncreaseFee}
    />
  );

  return (
    <TransactionItemLayout
      openTxLink={openTxLink}
      rightElement={isEnabled ? increaseFeeButton : undefined}
      txCaption={txCaption}
      txIcon={
        <BitcoinTransactionIcon
          icon={
            inscriptionData ? <InscriptionIcon inscription={inscriptionData} /> : <BtcAvatarIcon />
          }
          transaction={transaction}
          btcAddress={bitcoinAddress}
        />
      }
      txStatus={<BitcoinTransactionStatus transaction={transaction} />}
      txTitle={<TransactionTitle title={title} />}
      txValue={value}
    />
  );
}
