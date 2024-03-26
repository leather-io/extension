import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

import { shimmerStyles } from '../../../../theme/global/shimmer-styles';

interface AccountNameLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AccountNameLayout = memo(({ children, isLoading }: AccountNameLayoutProps) => (
  <styled.span
    fontWeight={500}
    textStyle="label.02"
    aria-busy={isLoading}
    data-state={isLoading ? 'loading' : undefined}
    className={shimmerStyles}
  >
    {children}
  </styled.span>
));
