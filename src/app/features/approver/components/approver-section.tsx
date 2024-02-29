import { styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

export function ApproverSection(props: HasChildren) {
  return (
    <styled.section
      className="approver-section"
      mt="space.03"
      mx="space.03"
      px="space.05"
      py="space.03"
      rounded="sm"
      background="ink.background-primary"
      {...props}
    />
  );
}
