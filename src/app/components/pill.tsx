import { Box, BoxProps, styled } from 'leather-styles/jsx';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface PillProps extends BoxProps {
  hoverLabel?: string;
  label: string;
}
export function Pill({ hoverLabel, label, ...props }: PillProps) {
  return (
    <BasicTooltip label={hoverLabel} side="bottom">
      <Box
        border="default"
        borderRadius="xs"
        lineHeight="16px"
        ml="space.03"
        px="space.02"
        {...props}
      >
        <styled.span textStyle="caption.02">{label}</styled.span>
      </Box>
    </BasicTooltip>
  );
}
