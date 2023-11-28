import { Title } from '@app/ui/components/typography/title';

interface BitcoinTransactionValueProps {
  children: string;
}
export function BitcoinTransactionValue({ children }: BitcoinTransactionValueProps) {
  return <Title fontWeight="normal">{children}</Title>;
}
