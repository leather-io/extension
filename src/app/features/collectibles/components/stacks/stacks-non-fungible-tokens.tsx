import { Metadata as StacksNftMetadata } from '@hirosystems/token-metadata-api-client';

import { isValidUrl } from '@shared/utils/validate-url';

import { StxIcon } from '@app/ui/components/icons/stx-icon';

import { CollectibleImage } from '../_collectible-types/collectible-image';
import { ImageUnavailable } from '../image-unavailable';

interface StacksNonFungibleTokensProps {
  metadata: StacksNftMetadata;
}
export function StacksNonFungibleTokens({ metadata }: StacksNonFungibleTokensProps) {
  const isImageAvailable = metadata.cached_image && isValidUrl(metadata.cached_image);

  if (!isImageAvailable) return <ImageUnavailable />;

  return (
    <CollectibleImage
      alt="stacks nft"
      icon={<StxIcon size="lg" />}
      src={metadata.cached_image ?? ''}
      subtitle="Stacks NFT"
      title={metadata.name ?? ''}
    />
  );
}
