import { styled } from 'leather-styles/jsx';
import { HTMLStyledProps } from 'leather-styles/types';

export type HrProps = HTMLStyledProps<'hr'>;

export function Hr(props: HrProps) {
  return <styled.hr border="default" width="100%" {...props} />;
}

export function DashedHr(props: HrProps) {
  return (
    <styled.hr
      border="1px dashed"
      borderColor="accent.border-default !important"
      width="100%"
      {...props}
    />
  );
}
