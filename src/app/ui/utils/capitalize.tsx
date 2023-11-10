import { ReactNode } from 'react';

import { styled } from 'leather-styles/jsx';

export function Capitalize({ children }: { children: ReactNode }) {
  return <styled.span textTransform="capitalize">{children}</styled.span>;
}
