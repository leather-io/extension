import { styled } from 'leather-styles/jsx';

interface BitcoinTransactionCaptionProps {
  children: string;
}
export function BitcoinTransactionCaption({ children }: BitcoinTransactionCaptionProps) {
  return (
    <styled.span textStyle="caption.02" whiteSpace="nowrap">
      {children}
    </styled.span>
  );
}
