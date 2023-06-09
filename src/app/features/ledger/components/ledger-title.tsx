import { BoxProps } from '@stacks/ui';

import { SupportedBlockchains } from '@shared/constants';

import { capitalize } from '@app/common/utils';
import { Title } from '@app/components/typography';

export function LedgerTitle(props: BoxProps) {
  const { children, ...rest } = props;
  return (
    <Title fontSize={3} lineHeight={1.4} {...rest}>
      {children}
    </Title>
  );
}

interface LedgerConnectInstructionTitleProps extends BoxProps {
  chain: SupportedBlockchains;
}
export function LedgerConnectInstructionTitle({
  chain,
  ...props
}: LedgerConnectInstructionTitleProps) {
  return (
    <LedgerTitle {...props}>
      Plug in your Ledger, open the {capitalize(chain)} app and click connect
    </LedgerTitle>
  );
}
