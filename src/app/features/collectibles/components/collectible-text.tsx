import { OrdinalMinimalIcon } from '@app/components/icons/ordinal-minimal-icon';

import { CollectibleTextLayout } from './collectible-text.layout';
import { CollectibleLayout, CollectibleLayoutProps } from './collectible.layout';

interface CollectibleTextProps extends Omit<CollectibleLayoutProps, 'children'> {
  contentSrc: string;
}

export function CollectibleText(props: CollectibleTextProps) {
  const { contentSrc, ...rest } = props;
  return (
    <CollectibleLayout collectibleTypeIcon={<OrdinalMinimalIcon />} {...rest}>
      <CollectibleTextLayout contentSrc={contentSrc} />
    </CollectibleLayout>
  );
}
