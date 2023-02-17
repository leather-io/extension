import { Box } from '@stacks/ui';

import { OrdinalIconFull } from '@app/components/icons/ordinal-icon-full';

import { BaseCollectible, BaseCollectibleProps } from './base-collectible';

interface OtherCollectibleProps extends Omit<BaseCollectibleProps, 'children'> {
  // Nothing yet, although interfaces tend to offer better IDE experience.
}
export function OtherCollectible(props: OtherCollectibleProps) {
  return (
    <BaseCollectible {...props}>
      <Box width="90px">
        <OrdinalIconFull />
      </Box>
    </BaseCollectible>
  );
}
