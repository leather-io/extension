import { SyntheticEvent, useState } from 'react';

import StacksNft from '@assets/images/stacks-nft.png';

import { StacksNftMetadata } from '@shared/models/stacks-nft-metadata.model';
import { isValidUrl } from '@shared/utils/validate-url';

import { CollectibleLayout } from './collectible.layout';

const backgroundProps = {
  backgroundColor: 'transparent',
  border: 'transparent',
  borderRadius: '16px',
};

const placeholderBackgroundProps = {
  backgroundColor: 'white',
  border: '1px solid #DCDDE2',
  borderRadius: '16px',
};

interface StacksNftCryptoAssetsProps {
  metadata: StacksNftMetadata;
}
export function StacksNonFungibleTokens({ metadata }: StacksNftCryptoAssetsProps) {
  const [bkgrdProps, setBkgrdProps] = useState(backgroundProps);
  const isImageAvailable = metadata && metadata.cached_image && isValidUrl(metadata?.cached_image);
  const placeholderImage = StacksNft;

  const onImageError = (evt: SyntheticEvent<HTMLImageElement>) => {
    evt.currentTarget.src = StacksNft;
    evt.currentTarget.width = 100;
    setBkgrdProps(placeholderBackgroundProps);
  };

  if (!isImageAvailable) return null;

  return (
    <CollectibleLayout
      backgroundElementProps={bkgrdProps}
      subtitle="Stacks NFT"
      title={metadata?.name ?? 'Unknown'}
    >
      <img
        alt="nft image"
        onError={onImageError}
        src={isImageAvailable ? metadata?.cached_image : placeholderImage}
        style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
      />
    </CollectibleLayout>
  );
}
