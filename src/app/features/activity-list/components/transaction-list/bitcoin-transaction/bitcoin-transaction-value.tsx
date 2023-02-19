import { Title } from '@app/components/typography';

interface BitcoinTransactionValueProps {
  children: string;
}
export function BitcoinTransactionValue({ children }: BitcoinTransactionValueProps) {
  return <Title fontWeight="normal">{children}</Title>;
}
