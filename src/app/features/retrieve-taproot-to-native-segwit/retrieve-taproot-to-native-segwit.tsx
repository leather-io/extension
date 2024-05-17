import { useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';
import { delay } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { formatMoneyPadded } from '@app/common/money/format-money';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';
import { useToast } from '@app/features/toasts/use-toast';
import {
  useCurrentTaprootAccountBalance,
  useCurrentTaprootAccountUninscribedUtxos,
} from '@app/query/bitcoin/balance/btc-balance-taproot.hooks';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { Link } from '@app/ui/components/link/link';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { RetrieveTaprootToNativeSegwitLayout } from './components/retrieve-taproot-to-native-segwit.layout';
import { useGenerateRetrieveTaprootFundsTx } from './use-generate-retrieve-taproot-funds-tx';

export function RetrieveTaprootToNativeSegwit() {
  const toast = useToast();
  const navigate = useNavigate();
  const balance = useCurrentTaprootAccountBalance();
  const recipient = useCurrentAccountNativeSegwitAddressIndexZero();
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();
  const analytics = useAnalytics();
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
