import { styled } from 'leather-styles/jsx';

import { EyeSlashIcon } from '@leather-wallet/ui';

import { CollectiblePlaceholderLayout } from './_collectible-types/collectible-placeholder.layout';

export function ImageUnavailable() {
  return (
    <CollectiblePlaceholderLayout>
      <EyeSlashIcon />
      <styled.span pt="space.02" px="space.04" textStyle="label.03">
        Image currently unavailable
      </styled.span>
    </CollectiblePlaceholderLayout>
  );
}
