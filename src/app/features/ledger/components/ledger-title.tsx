import { BoxProps, styled } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';


export function LedgerTitle(props: BoxProps) {
  const { children, ...rest } = props;
  return (
    <styled.span textStyle="heading.05" {...rest}>
      {children}
    </styled.span>
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
      Plug in your Ledger, open the <styled.span textTransform="capitalize">{chain}</styled.span> app and click connect
    </LedgerTitle>
  );
}
