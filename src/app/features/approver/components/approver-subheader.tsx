import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

type ApproverSubheaderProps = HTMLStyledProps<'h2'>;

export function ApproverSubheader(props: ApproverSubheaderProps) {
  return <styled.h2 textStyle="label.01" mb="space.03" {...props} />;
}
