import { type FungiblePostConditionWire } from '@stacks/transactions';
import { Box, Stack, styled } from 'leather-styles/jsx';

import { ItemLayout, StxAvatarIcon } from '@leather.io/ui';

import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useAssetFromFungiblePostCondition } from '@app/store/transactions/post-conditions.hooks';

import { formatPostConditionMessage } from './post-conditions.utils';

interface FungiblePostConditionItemProps {
  isContractPrincipal: boolean;
  isLast: boolean;
  postCondition: FungiblePostConditionWire;
}
export function FungiblePostConditionItem({
  isContractPrincipal,
  isLast,
  postCondition,
}: FungiblePostConditionItemProps) {
  const currentAccount = useCurrentStacksAccount();
  const asset = useAssetFromFungiblePostCondition(postCondition);

  const { amount, contract, contractId, iconString, message, name, ticker, title } =
    formatPostConditionMessage({
      account: currentAccount,
      asset,
      isContractPrincipal,
      postCondition,
    });

  const imageCanonicalUri =
    asset?.image_canonical_uri &&
    asset.name &&
    getSafeImageCanonicalUri(asset.image_canonical_uri, asset.name);

  const icon =
    iconString !== 'STX' ? (
      <StacksAssetAvatar gradientString={contractId} img={imageCanonicalUri} />
    ) : (
      <StxAvatarIcon />
    );

  return (
    <Stack gap="space.03">
      <styled.span textStyle="label.03">{title}</styled.span>
      <ItemLayout
        img={icon}
        titleLeft={ticker}
        captionLeft={name}
        titleRight={amount}
        captionRight={contract}
      />
      {message && (
        <Box pt="space.03" borderTop="default" borderBottom={!isLast ? 'active' : 'unset'}>
          <styled.span color="ink.text-subdued" textStyle="caption.01">
            {message}
          </styled.span>
        </Box>
      )}
    </Stack>
  );
}
