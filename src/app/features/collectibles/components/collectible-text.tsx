import { OrdinalMinimalIcon } from '@app/components/icons/ordinal-minimal-icon';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from './collectible-item.layout';
import { CollectibleTextLayout } from './collectible-text.layout';

interface CollectibleTextProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  contentSrc: string;
}

export function CollectibleText(props: CollectibleTextProps) {
  const { contentSrc, ...rest } = props;
  return (
    <CollectibleItemLayout collectibleTypeIcon={<OrdinalMinimalIcon />} {...rest}>
      <CollectibleTextLayout contentSrc={contentSrc} />
    </CollectibleItemLayout>
  );
}
