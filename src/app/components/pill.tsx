import { Box, BoxProps, styled } from 'leather-styles/jsx';

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
        ml="space.03"
        px="space.02"
        {...props}
      >
        <styled.span textStyle="caption.02">{label}</styled.span>
      </Box>
    </Tooltip>
  );
}
