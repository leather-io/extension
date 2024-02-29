import type { ReactNode } from 'react';

import { styled } from 'leather-styles/jsx';

interface ApproverHeaderProps {
  title: ReactNode;
  requester: ReactNode;
}
export function ApproverHeader({ title, requester }: ApproverHeaderProps) {
  return (
    <styled.header px="space.05" py="space.03">
      <styled.h1 textStyle="heading.03">{title}</styled.h1>
      <styled.p textStyle="label.02" mt="space.03">
        Requested by {requester}
      </styled.p>
    </styled.header>
  );
}
