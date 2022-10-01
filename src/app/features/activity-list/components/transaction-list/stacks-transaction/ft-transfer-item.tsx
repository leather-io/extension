import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

import {
  calculateTokenTransferAmount,
  getTxCaption,
} from '@app/common/transactions/stacks/transaction.utils';
import { pullContractIdFromIdentity } from '@app/common/utils';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useFungibleTokenMetadata } from '@app/query/stacks/fungible-tokens/fungible-token-metadata.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { imageCanonicalUriFromFtMetadata } from '@app/common/token-utils';
import { AssetAvatar } from '@app/components/stx-avatar';
import {
  FtTransfer,
  TxTransferDetails,
} from '@shared/models/transactions/stacks-transaction.model';

import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';

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
  const ftImageCanonicalUri = imageCanonicalUriFromFtMetadata(assetMetadata);
  const icon = isOriginator ? FiArrowUp : FiArrowDown;
  const title = `${assetMetadata?.name || 'Token'} Transfer`;
  const value = `${isOriginator ? '-' : ''}${displayAmount.toFormat()}`;
  const transferIcon = ftImageCanonicalUri ? (
    <AssetAvatar
      size="36px"
      imageCanonicalUri={ftImageCanonicalUri}
      color="white"
      gradientString={''}
      useStx={false}
    >
      {title}
    </AssetAvatar>
  ) : (
    <TxTransferIconWrapper icon={icon} />
  );

  const transferDetails: TxTransferDetails = {
    caption,
    icon: transferIcon,
    link: parentTx.tx.tx_id,
    title,
    value,
  };

  return <StacksTransactionItem transferDetails={transferDetails} />;
}
