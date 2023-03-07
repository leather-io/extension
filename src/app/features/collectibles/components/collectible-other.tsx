import { Box } from '@stacks/ui';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';

import { CollectibleLayout, CollectibleLayoutProps } from './collectible.layout';

interface OtherCollectibleProps extends Omit<CollectibleLayoutProps, 'children'> {}
export function CollectibleOther(props: OtherCollectibleProps) {
  return (
    <CollectibleLayout {...props}>
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
    </CollectibleLayout>
  );
}
