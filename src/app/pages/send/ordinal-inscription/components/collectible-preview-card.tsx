import { Flex, FlexProps } from '@stacks/ui';

import { Inscription } from '../use-send-ordinal-inscription-route-state';
import { CollectibleImage } from './image';
import { CollectibleMetadata } from './metadata';

interface CollectiblePreviewCardProps extends FlexProps {
  inscription: Inscription;
  icon?: JSX.Element;
}

export function CollectiblePreviewCard({
  inscription,
  icon,
  ...props
}: CollectiblePreviewCardProps) {
  return (
    <Flex
      border="1px solid"
      borderColor="#DCDDE2"
      borderRadius="10px"
      flexDirection="row"
      width="100%"
      p="base"
      columnGap="16px"
      {...props}
    >
      <CollectibleImage inscription={inscription} />
      <CollectibleMetadata inscription={inscription} icon={icon} />
    </Flex>
  );
}
