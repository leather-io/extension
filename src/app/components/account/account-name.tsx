import { memo } from 'react';

import { css } from 'leather-styles/css';
import { styled } from 'leather-styles/jsx';

import { shimmerStyles } from '@app/ui/shared/shimmer-styles';

interface AccountNameLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AccountNameLayout = memo(({ children, isLoading }: AccountNameLayoutProps) => (
  <styled.span
    className={css(shimmerStyles)}
    textStyle="label.02"
    aria-busy={isLoading}
    data-state={isLoading ? 'loading' : undefined}
  >
    {children}
  </styled.span>
));
