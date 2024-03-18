import { styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

import { useRegisterApproverChild } from '../approver.context';

export function ApproverSection(props: HasChildren) {
  useRegisterApproverChild('section');
  return (
    <styled.section
      className="approver-section"
      mt="space.03"
      px="space.05"
      py="space.03"
      rounded="sm"
      background="ink.background-primary"
      {...props}
    />
  );
}
