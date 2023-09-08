import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface BitcoinTransactionCaptionProps {
  children: string;
}
export function BitcoinTransactionCaption({ children }: BitcoinTransactionCaptionProps) {
  return (
    <styled.span color={token('colors.accent.text-subdued')} fontSize={0} whiteSpace="nowrap">
      {children}
    </styled.span>
  );
}
