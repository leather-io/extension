import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { useRegisterApproverChild } from '../approver.context';

type ApproverSubheaderProps = HTMLStyledProps<'h2'>;

export function ApproverSubheader(props: ApproverSubheaderProps) {
  useRegisterApproverChild('subheader');
  return <styled.h2 textStyle="label.01" mb="space.03" {...props} />;
}
