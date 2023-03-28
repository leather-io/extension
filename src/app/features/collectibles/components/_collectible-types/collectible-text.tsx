import { OrdinalMinimalIcon } from '@app/components/icons/ordinal-minimal-icon';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from '../collectible-item.layout';
import { CollectibleTextLayout } from './collectible-text.layout';

interface CollectibleTextProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  content: string;
}
export function CollectibleText(props: CollectibleTextProps) {
  const { content, ...rest } = props;
  return (
    <CollectibleItemLayout collectibleTypeIcon={<OrdinalMinimalIcon />} {...rest}>
      <CollectibleTextLayout>{content}</CollectibleTextLayout>
    </CollectibleItemLayout>
  );
}
