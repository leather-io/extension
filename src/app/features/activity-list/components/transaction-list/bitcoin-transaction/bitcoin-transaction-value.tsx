import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { Title } from '@app/components/typography';

interface BitcoinTransactionValueProps {
  children: string;
}
export function BitcoinTransactionValue({ children }: BitcoinTransactionValueProps) {
  return (
    <Title data-testid={SendFormSelectors.SentTokenValue} fontWeight="normal">
      {children}
    </Title>
  );
}
