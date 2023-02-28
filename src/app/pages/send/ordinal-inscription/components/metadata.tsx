import { Flex } from '@stacks/ui';

import { Text } from '@app/components/typography';
import { OrdinalInfo } from '@app/query/bitcoin/ordinals/utils';

interface MetadataProps {
  inscription: OrdinalInfo;
}
export function Metadata({ inscription }: MetadataProps) {
  return (
    <Flex pl="8px" flexDirection="column" justifyContent="center" alignItems="flex-start">
      <Text fontSize="16px" fontWeight="500">
        {inscription.title}
      </Text>
      <Text fontSize="12px">Ordinal inscription</Text>
      {/* <Text fontSize="12px">Item name</Text> */}
    </Flex>
  );
}
