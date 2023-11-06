import { styled } from 'leather-styles/jsx';

import { color } from '@app/common/utils/stacks-ui/ui/colors';

interface BitcoinTransactionCaptionProps {
  children: string;
}

// #4383 FIXME - refactor this further - is this needed? fontSize set to 0 also?
export function BitcoinTransactionCaption({ children }: BitcoinTransactionCaptionProps) {
  return (
    <styled.span color={color('text-caption')} fontSize={0} whiteSpace="nowrap">
      {children}
    </styled.span>
  );
}
