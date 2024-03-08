import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { useRegisterApproverChild } from '../approver.context';

type ApproverSubheaderProps = HTMLStyledProps<'h2'>;

export function ApproverSubheader(props: ApproverSubheaderProps) {
  useRegisterApproverChild('subheader');
  return (
    <styled.h2
      display="flex"
      textStyle="label.01"
      alignItems="center"
      minH="40px"
      mb="space.03"
      gap="space.01"
      {...props}
    />
  );
}
