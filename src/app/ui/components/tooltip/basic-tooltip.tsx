import { ReactNode } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';

import { Tooltip } from './tooltip';

interface BasicTooltipProps {
  children: ReactNode;
  label?: string;
  disabled?: boolean;
  side?: RadixTooltip.TooltipContentProps['side'];
}

export function BasicTooltip({ children, label, disabled, side }: BasicTooltipProps) {
  const isDisabled = !label || disabled;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content hidden={isDisabled} side={side} sideOffset={5}>
          {label}
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
