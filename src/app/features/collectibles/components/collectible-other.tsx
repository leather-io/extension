import { Box } from '@stacks/ui';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';

import { CollectibleLayout, CollectibleLayoutProps } from './collectible.layout';

interface OtherCollectibleProps extends Omit<CollectibleLayoutProps, 'children'> {}
export function CollectibleOther(props: OtherCollectibleProps) {
  return (
    <CollectibleLayout {...props}>
      <Box width="90px">
        <OrdinalIconFull />
      </Box>
    </CollectibleLayout>
  );
}
