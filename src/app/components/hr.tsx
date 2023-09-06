import { Box, BoxProps } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';
import { JsxStyleProps } from 'leather-styles/types';

export function Hr(props: BoxProps) {
  return <Box as="hr" backgroundColor="#DCDDE2" width="100%" {...props} />;
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
