import { useCurrentTaprootAccountBalance } from '@leather-wallet/query';
import { Link } from '@leather-wallet/ui';
import { formatMoney } from '@leather-wallet/utils';

import { useRecoverUninscribedTaprootUtxosFeatureEnabled } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const taprootSpendNotSupportedYetMsg = `
  Total amount of BTC in your Taproot account addresses. Click to
  retrieve these funds.
`;

interface TaprootBalanceDisplayerProps {
  onSelectRetrieveBalance(): void;
}
export function TaprootBalanceDisplayer({ onSelectRetrieveBalance }: TaprootBalanceDisplayerProps) {
  const currentAccountIndex = useCurrentAccountIndex();
  const account = useCurrentTaprootAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();

  const balance = useCurrentTaprootAccountBalance({
    currentAccountIndex,
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });
  const isRecoverFeatureEnabled = useRecoverUninscribedTaprootUtxosFeatureEnabled();
  if (!isRecoverFeatureEnabled) return null;
  if (balance.amount.isLessThanOrEqualTo(0)) return null;
  return (
    <BasicTooltip label={taprootSpendNotSupportedYetMsg} asChild>
      <Link onClick={() => onSelectRetrieveBalance()} textStyle="caption.01" variant="text">
        {formatMoney(balance)}
      </Link>
    </BasicTooltip>
  );
}
