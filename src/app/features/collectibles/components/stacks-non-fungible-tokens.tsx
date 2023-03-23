import { useState } from 'react';

import { Metadata as StacksNftMetadata } from '@hirosystems/token-metadata-api-client';
import { Spinner } from '@stacks/ui';

import { isValidUrl } from '@shared/utils/validate-url';

import { figmaTheme } from '@app/common/utils/figma-theme';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';

import { CollectibleItemLayout } from './collectible-item.layout';
import { ImageUnavailable } from './components/image-unavailable';

const backgroundProps = {
  backgroundColor: 'transparent',
  border: 'transparent',
  borderRadius: '16px',
};

interface StacksNftCryptoAssetsProps {
  metadata: StacksNftMetadata;
}
export function StacksNonFungibleTokens({ metadata }: StacksNftCryptoAssetsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const isImageAvailable = metadata.cached_image && isValidUrl(metadata.cached_image);

  return (
    <CollectibleItemLayout
      backgroundElementProps={backgroundProps}
      subtitle="Stacks NFT"
      title={metadata.name ?? ''}
      collectibleTypeIcon={<StxAvatar size="30px" />}
    >
      {isError || !isImageAvailable ? (
        <ImageUnavailable />
      ) : (
        <>
          {isLoading && <Spinner color={figmaTheme.icon} size="16px" />}
          <img
            alt="nft image"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsError(true)}
            src={metadata.cached_image}
            style={{
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              display: isLoading ? 'none' : 'inherit',
            }}
          />
        </>
      )}
    </CollectibleItemLayout>
  );
}
