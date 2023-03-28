import { Box, Flex, Text, color } from '@stacks/ui';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

interface PsbtBtcNodeLayoutProps {
  subtitle: string;
  value: string;
}
export function PsbtBtcNodeLayout({ subtitle, value }: PsbtBtcNodeLayoutProps) {
  return (
    <Flag align="middle" img={<BtcIcon />} mt="loose" spacing="base">
      <SpaceBetween>
        <Flex alignItems="flex-start" flexDirection="column" justifyContent="center">
          <Text fontSize={3} fontWeight="500">
            BTC
          </Text>
          <Text color={color('text-caption')} fontSize={1}>
            {subtitle}
          </Text>
        </Flex>
        <Box>
          <Text fontSize={3} fontWeight="500">
            {value}
          </Text>
        </Box>
      </SpaceBetween>
    </Flag>
  );
}
