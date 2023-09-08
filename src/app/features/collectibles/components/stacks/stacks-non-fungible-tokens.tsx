import { Metadata as StacksNftMetadata } from '@hirosystems/token-metadata-api-client';

import { isValidUrl } from '@shared/utils/validate-url';

import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';

import { CollectibleImage } from '../_collectible-types/collectible-image';
import { ImageUnavailable } from '../image-unavailable';

const backgroundProps = {
  backgroundColor: 'transparent',
  border: 'transparent',
  borderRadius: '16px',
};

interface StacksNonFungibleTokensProps {
  metadata: StacksNftMetadata;
}
export function StacksNonFungibleTokens({ metadata }: StacksNonFungibleTokensProps) {
  const isImageAvailable = metadata.cached_image && isValidUrl(metadata.cached_image);

  if (!isImageAvailable) return <ImageUnavailable />;

  return (
    <CollectibleImage
      alt="stacks nft"
      backgroundElementProps={backgroundProps}
      icon={<StxAvatar height="30px" width="30px" />}
      src={metadata.cached_image ?? ''}
      subtitle="Stacks NFT"
      title={metadata.name ?? ''}
    />
  );
}
