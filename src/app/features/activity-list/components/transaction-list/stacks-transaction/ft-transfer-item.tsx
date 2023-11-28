import type { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { logger } from '@shared/logger';
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
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/tokens/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '@app/query/stacks/tokens/token-metadata.utils';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';

import { TxTransferIconWrapper } from './tx-transfer-icon-wrapper';

interface FtTransferItemProps {
  ftTransfer: FtTransfer;
  parentTx: AddressTransactionWithTransfers;
}
export function FtTransferItem({ ftTransfer, parentTx }: FtTransferItemProps) {
  const { data: assetMetadata } = useGetFungibleTokenMetadataQuery(
    pullContractIdFromIdentity(ftTransfer.asset_identifier)
  );
  const currentAccount = useCurrentStacksAccount();
  const isOriginator = ftTransfer.sender === currentAccount?.address;

  if (!(assetMetadata && isFtAsset(assetMetadata))) {
    logger.error('Token metadata not found');
    return null;
  }

  const displayAmount = calculateTokenTransferAmount(
    assetMetadata?.decimals ?? 0,
    ftTransfer.amount
  );
  if (typeof displayAmount === 'undefined') return null;

  const caption = getTxCaption(parentTx.tx) ?? '';
  const ftImageCanonicalUri =
    assetMetadata.image_canonical_uri &&
    assetMetadata.name &&
    getImageCanonicalUri(assetMetadata.image_canonical_uri, assetMetadata.name);
  const icon = isOriginator ? <ArrowUpIcon size="xs" /> : <ArrowDownIcon size="xs" />;
  const title = `${assetMetadata.name || 'Token'} Transfer`;
  const value = `${isOriginator ? '-' : ''}${displayAmount.toFormat()}`;
  const transferIcon = ftImageCanonicalUri ? (
    <StacksAssetAvatar
      color="accent.background-primary"
      gradientString=""
      imageCanonicalUri={ftImageCanonicalUri}
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
