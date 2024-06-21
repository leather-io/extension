import { useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import {
  useBitcoinBroadcastTransaction,
  useCurrentTaprootAccountBalance,
  useCurrentTaprootAccountUninscribedUtxos,
} from '@leather.io/query';
import { Link } from '@leather.io/ui';
import { delay, formatMoneyPadded, truncateMiddle } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentAccountNativeSegwitAddressIndexZero,
  useCurrentAccountNativeSegwitIndexZeroSigner,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { RetrieveTaprootToNativeSegwitLayout } from './components/retrieve-taproot-to-native-segwit.layout';
import { useGenerateRetrieveTaprootFundsTx } from './use-generate-retrieve-taproot-funds-tx';

export function RetrieveTaprootToNativeSegwit() {
  const toast = useToast();
  const navigate = useNavigate();

  const currentAccountIndex = useCurrentAccountIndex();
  const account = useCurrentTaprootAccount();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const balance = useCurrentTaprootAccountBalance({
    currentAccountIndex,
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
  });
  const recipient = useCurrentAccountNativeSegwitAddressIndexZero();
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos({
    taprootKeychain: account?.keychain,
    nativeSegwitAddress: nativeSegwitSigner.address,
    currentAccountIndex,
  });

  const { generateRetrieveTaprootFundsTx, fee } = useGenerateRetrieveTaprootFundsTx();
  const { broadcastTx, isBroadcasting } = useBitcoinBroadcastTransaction();

  async function handleBroadcastRetrieveBitcoinTx() {
    const tx = await generateRetrieveTaprootFundsTx({ recipient, fee });
    await broadcastTx({
      tx,
      async onSuccess() {
        await delay(1200);
        toast.success('Transaction submitted!');
        await delay(700);
        navigate(RouteUrls.Activity);
        void analytics.track('broadcast_retrieve_taproot_to_native_segwit');
      },
      onError(e) {
        alert(e);
      },
    });
  }

  return (
    <RetrieveTaprootToNativeSegwitLayout
      isBroadcasting={isBroadcasting}
      onApproveTransaction={handleBroadcastRetrieveBitcoinTx}
      onClose={() => navigate(RouteUrls.Home)}
    >
      <Stack width="100%">
        <InfoCardRow title="Your address" value={<FormAddressDisplayer address={recipient} />} />
        <InfoCardSeparator />
        <InfoCardRow title="Amount" value={formatMoneyPadded(balance)} />
        <InfoCardRow title="Fee" value={formatMoneyPadded(fee)} />
        <InfoCardSeparator />
        {uninscribedUtxos.map((utxo, i) => (
          <InfoCardRow
            key={utxo.txid}
            title={`Uninscribed UTXO #${i}`}
            value={
              <Link href={`https://ordinals.com/output/${utxo.txid}:${utxo.vout}`}>
                {`${truncateMiddle(utxo.txid, 4)}:${utxo.vout}`} ↗
              </Link>
            }
          />
        ))}
      </Stack>
    </RetrieveTaprootToNativeSegwitLayout>
  );
}
