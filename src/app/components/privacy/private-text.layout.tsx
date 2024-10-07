import React from 'react';

import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface PrivateTextLayoutProps extends HTMLStyledProps<'span'> {
  children: React.ReactNode;
  isPrivate?: boolean;
  onShowValue?(): void;
}

export function PrivateTextLayout({
  isPrivate,
  onShowValue,
  children,
  style = {},
  ...rest
}: PrivateTextLayoutProps) {
  const canShowValue = isPrivate && onShowValue;

  return (
    <BasicTooltip label="Show value" disabled={!canShowValue} asChild>
      <styled.span
        {...rest}
        onClick={canShowValue ? onShowValue : undefined}
        cursor={canShowValue ? 'pointer' : undefined}
        style={{
          ...style,
          fontFamily: isPrivate ? 'Fira Code, Consolata, monospace' : style?.fontFamily,
          letterSpacing: isPrivate ? '0.05em' : style?.letterSpacing,
        }}
      >
        {isPrivate ? '***' : children}
      </styled.span>
    </BasicTooltip>
  );
}
