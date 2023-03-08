import { Box } from '@stacks/ui';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from './collectible-item.layout';

interface OtherCollectibleProps extends Omit<CollectibleItemLayoutProps, 'children'> {}
export function CollectibleOther(props: OtherCollectibleProps) {
  return (
    <CollectibleItemLayout {...props}>
      <Box
        backgroundColor="black"
        height="100%"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <OrdinalIconFull />
      </Box>
    </CollectibleItemLayout>
  );
}
