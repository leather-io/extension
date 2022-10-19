import { BoxProps, Box } from '@stacks/ui';

export function WalletTypeLedgerIcon(props: BoxProps) {
  return (
    <Box
      as="img"
      src="assets/images/wallet-type-ledger.svg"
      width="24px"
      height="24px"
      {...props}
    />
  );
}
