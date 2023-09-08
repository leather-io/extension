import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import { JsxStyleProps } from 'leather-styles/types';

export function Hr({ my = 'unset', height = 'auto' }: { my?: string; height?: string }) {
  return (
    <styled.hr
      backgroundColor={token('colors.accent.background-primary')}
      width="100%"
      my={my}
      height={height}
    />
  );
}

export function DashedHr(props: JsxStyleProps) {
  return (
    <styled.hr
      border="1px dashed"
      borderColor="accent.border-default !important"
      width="100%"
      {...props}
    />
  );
}
