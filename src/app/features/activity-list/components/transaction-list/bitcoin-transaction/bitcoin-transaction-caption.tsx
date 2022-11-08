import { Text, color } from '@stacks/ui';

interface BitcoinTransactionCaptionProps {
  children: string;
}
export function BitcoinTransactionCaption({ children }: BitcoinTransactionCaptionProps) {
  return (
    <Text color={color('text-caption')} fontSize={0} whiteSpace="nowrap">
      {children}
    </Text>
  );
}
