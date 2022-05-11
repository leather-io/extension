import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import {
  calculateTokenTransferAmount,
  FtTransfer,
  getTxCaption,
} from '@app/common/transactions/transaction-utils';
import { useFungibleTokenMetadata } from '@app/query/tokens/fungible-token-metadata.hook';
import { pullContractIdFromIdentity } from '@app/common/utils';

import { TxTransferDetails } from './transaction-transfers';
import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';
import { TransactionItem } from './transaction-item';

interface FtTransferItemProps {
  ftTransfer: FtTransfer;
  parentTx: AddressTransactionWithTransfers;
}
export function FtTransferItem({ ftTransfer, parentTx }: FtTransferItemProps) {
  const assetMetadata = useFungibleTokenMetadata(
    pullContractIdFromIdentity(ftTransfer.asset_identifier)
  );
  const currentAccount = useCurrentAccount();
  const isOriginator = ftTransfer.sender === currentAccount?.address;

  const displayAmount = calculateTokenTransferAmount(
    assetMetadata?.decimals ?? 0,
    ftTransfer.amount
  );
  if (typeof displayAmount === 'undefined') return null;

  const caption = getTxCaption(parentTx.tx) ?? '';
  const icon = isOriginator ? FiArrowUp : FiArrowDown;
  const title = `${assetMetadata?.name || 'Token'} Transfer`;
  const value = `${isOriginator ? '-' : ''}${displayAmount.toFormat()}`;

  const transferDetails: TxTransferDetails = {
    caption,
    icon: <TxTransferIconWrapper icon={icon} />,
    link: parentTx.tx.tx_id,
    title,
    value,
  };

  return <TransactionItem transferDetails={transferDetails} />;
}
