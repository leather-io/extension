import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

interface AccountNameLayoutProps {
  children: React.ReactNode;
}
export const AccountNameLayout = memo(({ children }: AccountNameLayoutProps) => (
  <styled.span fontWeight={500} textStyle="label.02">
    {children}
  </styled.span>
));
