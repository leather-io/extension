import { ReactNode } from 'react';

import { AudioIcon } from '@app/ui/components/icons/audio-icon';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from '../collectible-item.layout';
import { CollectiblePlaceholderLayout } from './collectible-placeholder.layout';

interface CollectibleAudioProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  icon: ReactNode;
}
export function CollectibleAudio({ icon, ...props }: CollectibleAudioProps) {
  return (
    <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
      <CollectiblePlaceholderLayout>
        <AudioIcon size="xl" />
      </CollectiblePlaceholderLayout>
    </CollectibleItemLayout>
  );
}
