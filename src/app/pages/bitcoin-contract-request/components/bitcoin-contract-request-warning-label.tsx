import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';

import { WarningLabel } from '@app/components/warning-label';

export function BitcoinContractRequestWarningLabel(props: { appName?: string }) {
  const { appName } = props;
  const title = `Do not proceed unless you trust ${appName ?? 'Unknown'}!`;

  return (
    <WarningLabel
      title={title}
      width="100%"
      data-testid={BitcoinContractRequestSelectors.BitcoinContractWarningLabel}
    >
      By signing the contract YOU AGREE TO LOCK YOUR BITCOIN with {appName} into a contract where it
      will remain until a triggering event will release it.
    </WarningLabel>
  );
}
