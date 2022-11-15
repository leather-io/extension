import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import {
  FtTransfer,
  TxTransferDetails,
} from '@shared/models/transactions/stacks-transaction.model';

import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import {
  calculateTokenTransferAmount,
  getTxCaption,
} from '@app/common/transactions/stacks/transaction.utils';
import { pullContractIdFromIdentity } from '@app/common/utils';
import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/fungible-tokens/fungible-token-metadata.query';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';

interface FtTransferItemProps {
  ftTransfer: FtTransfer;
  parentTx: AddressTransactionWithTransfers;
}
export function FtTransferItem({ ftTransfer, parentTx }: FtTransferItemProps) {
  const { data: assetMetadata } = useGetFungibleTokenMetadataQuery(
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
  const ftImageCanonicalUri =
    assetMetadata && getImageCanonicalUri(assetMetadata.image_canonical_uri, assetMetadata.name);
  const icon = isOriginator ? FiArrowUp : FiArrowDown;
  const title = `${assetMetadata?.name || 'Token'} Transfer`;
  const value = `${isOriginator ? '-' : ''}${displayAmount.toFormat()}`;
  const transferIcon = ftImageCanonicalUri ? (
    <StacksAssetAvatar
      size="36px"
      imageCanonicalUri={ftImageCanonicalUri}
      color="white"
      gradientString=""
    >
      {title}
    </StacksAssetAvatar>
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
