import { styled } from 'leather-styles/jsx';

// #4164 FIXME migrate - do we even need these wrappers?
export function WalletTypeLedgerIcon() {
  return (
    <styled.img
      src="assets/images/wallet-type-ledger.svg"
      width="24px"
      height="24px"
      mr="space.03"
    />
  );
}
