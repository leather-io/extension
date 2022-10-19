import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';

export function LedgerTitle(props: BoxProps) {
  const { children, ...rest } = props;
  return (
    <Title fontSize={3} lineHeight={1.4} {...rest}>
      {children}
    </Title>
  );
}

export function LedgerConnectInstructionTitle(props: BoxProps) {
  return (
    <LedgerTitle {...props}>Plug in your Ledger, open the Stacks app and click connect</LedgerTitle>
  );
}
