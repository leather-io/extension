import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';

export enum LedgerDrawerType {
  Connect = 'Plug in your Ledger, open the Stacks app and click connect',
  Disconnected = 'Your Ledger has disconnected',
  Transaction = 'Verify the transaction details on your Ledger',
}

interface LedgerTitleProps extends BoxProps {
  type: LedgerDrawerType;
}
export function LedgerTitle(props: LedgerTitleProps) {
  const { type, ...rest } = props;
  return (
    <Title fontSize={3} lineHeight={1.4} {...rest}>
      {type}
    </Title>
  );
}
