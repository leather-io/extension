import { memo } from 'react';

import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { shimmerStyles } from '@leather.io/ui';

interface AccountNameLayoutProps extends HTMLStyledProps<'span'> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AccountNameLayout = memo(
  ({ children, isLoading, ...rest }: AccountNameLayoutProps) => (
    <styled.span
      className={shimmerStyles}
      textStyle="label.02"
      aria-busy={isLoading}
      data-state={isLoading ? 'loading' : undefined}
      {...rest}
    >
      {children}
    </styled.span>
  )
);
