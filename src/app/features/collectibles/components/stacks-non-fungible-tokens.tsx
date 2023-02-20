import { SyntheticEvent } from 'react';

import StacksNft from '@assets/images/stacks-nft.png';

import { StacksNftMetadata } from '@shared/models/stacks-nft-metadata.model';
import { isValidUrl } from '@shared/utils/validate-url';

import { BaseCollectible } from './base-collectible';

const backgroundProps = {
  _hover: {
    cursor: 'pointer',
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(12, 12, 13, 0) 100%)',
    border: 'transparent',
    zIndex: 999,
  },
  backgroundColor: 'white',
  border: '1px solid #DCDDE2',
  borderRadius: '16px',
};

interface StacksNftCryptoAssetsProps {
  metadata: StacksNftMetadata;
}
export function StacksNonFungibleTokens({ metadata }: StacksNftCryptoAssetsProps) {
  const isImageAvailable = metadata && metadata.cached_image && isValidUrl(metadata?.cached_image);
  const placeholderImage = StacksNft;

  const onImageError = (evt: SyntheticEvent<HTMLImageElement>) => {
    evt.currentTarget.src = StacksNft;
    evt.currentTarget.width = 100;
  };

  return isImageAvailable ? (
    <BaseCollectible
      backgroundElementProps={backgroundProps}
      onClick={() => {}}
      subtitle="Stacks NFT"
      title={metadata?.name ?? ''}
    >
      <img
        alt="nft image"
        onError={onImageError}
        src={isImageAvailable ? metadata?.cached_image : placeholderImage}
        width="100%"
      />
    </BaseCollectible>
  ) : null;
}
