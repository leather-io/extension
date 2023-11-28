import { memo } from 'react';

import { styled } from 'leather-styles/jsx';

interface AccountNameLayoutProps {
  children: React.ReactNode;
}
export const AccountNameLayout = memo(({ children }: AccountNameLayoutProps) => (
  <styled.p textStyle="label.01">{children}</styled.p>
));
