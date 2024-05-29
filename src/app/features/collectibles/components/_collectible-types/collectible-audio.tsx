import { ReactNode } from 'react';

import { HeadsetIcon } from '@leather-wallet/ui';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from '../collectible-item.layout';
import { CollectiblePlaceholderLayout } from './collectible-placeholder.layout';

interface CollectibleAudioProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  icon: ReactNode;
}
export function CollectibleAudio({ icon, ...props }: CollectibleAudioProps) {
  return (
    <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
      <CollectiblePlaceholderLayout>
        <HeadsetIcon width="xl" />
      </CollectiblePlaceholderLayout>
    </CollectibleItemLayout>
  );
}
