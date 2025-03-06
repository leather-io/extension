import { ReactNode } from 'react';

import { HeadsetIcon } from '@leather.io/ui';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from './collectible-item.layout';
import { CollectiblePlaceholderLayout } from './collectible-placeholder.layout';

interface CollectibleAudioProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  icon: ReactNode;
}
export function CollectibleAudio({ icon, ...props }: CollectibleAudioProps) {
  return (
    <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
      <CollectiblePlaceholderLayout>
        <HeadsetIcon height={36} width={36} />
      </CollectiblePlaceholderLayout>
    </CollectibleItemLayout>
  );
}
