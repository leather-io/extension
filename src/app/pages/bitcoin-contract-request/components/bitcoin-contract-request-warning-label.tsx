import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';

import { Callout } from '@leather.io/ui';

export function BitcoinContractRequestWarningLabel(props: { appName?: string }) {
  const { appName } = props;

  return (
    <Callout
      data-testid={BitcoinContractRequestSelectors.BitcoinContractWarningLabel}
      variant="warning"
      title={`Do not proceed unless you trust ${appName ?? 'Unknown'}!`}
    >
      By signing the contract YOU AGREE TO LOCK YOUR BITCOIN with {appName} into a contract where it
      will remain until a triggering event will release it.
    </Callout>
  );
}
