import { Flex } from 'leather-styles/jsx';

import { Tag } from '@app/ui/components/tag/tag';

interface NetworkModeBadge {
  isTestnetChain: boolean;
  name: string;
}

export function NetworkModeBadge({ isTestnetChain, name }: NetworkModeBadge) {
  if (!isTestnetChain) return null;

  return (
    <Flex position="relative" zIndex={999}>
      <Tag label={name} transparent />
    </Flex>
  );
}
