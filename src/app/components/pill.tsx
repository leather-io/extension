import { Box, BoxProps, Text, color } from '@stacks/ui';

import { Tooltip } from './tooltip';

interface PillProps extends BoxProps {
  hoverLabel?: string;
  label: string;
}
export function Pill({ hoverLabel, label, ...props }: PillProps) {
  return (
    <Tooltip disabled={!hoverLabel} label={hoverLabel} maxWidth="200px" placement="bottom">
      <Box
        border="1px solid"
        borderRadius="24px"
        borderColor="#DCDDE2"
        lineHeight="16px"
        ml="base-tight"
        px="tight"
        {...props}
      >
        <Text color={color('text-caption')} fontSize={0} {...props}>
          {label}
        </Text>
      </Box>
    </Tooltip>
  );
}
