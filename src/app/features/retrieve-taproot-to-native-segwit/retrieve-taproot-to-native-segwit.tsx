import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import * as btc from 'micro-btc-signer';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { formatMoneyPadded } from '@app/common/money/format-money';
import { BtcSizeFeeEstimator } from '@app/common/transactions/bitcoin/fees/btc-size-fee-estimator';
import { delay, sumNumbers } from '@app/common/utils';
import { ExternalLink } from '@app/components/external-link';
import { InfoCard, InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';
import { PrimaryButton } from '@app/components/primary-button';
import { WarningLabel } from '@app/components/warning-label';
import {
  useCurrentTaprootAccountBalance,
  useCurrentTaprootAccountUninscribedUtxos,
} from '@app/query/bitcoin/balance/bitcoin-balances.query';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { getNumberOfInscriptionOnUtxo } from '@app/query/bitcoin/ordinals/utils';
import { useBitcoinBroadcastTransaction } from '@app/query/bitcoin/transaction/use-bitcoin-broadcast-transaction';
import { useBitcoinLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentBtcNativeSegwitAccountAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { RetrieveTaprootToNativeSegwitLayout } from './components/retrieve-taproot-to-native-segwit.layout';

export function RetrieveTaprooToNativeSegwit() {
  const navigate = useNavigate();
  const { setActiveTabActivity } = useHomeTabs();
  const balance = useCurrentTaprootAccountBalance();
  const createSigner = useCurrentAccountTaprootSigner();
  const { data: feeRate } = useBitcoinFeeRate();
  const nativeSegwitRecipient = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const uninscribedUtxos = useCurrentTaprootAccountUninscribedUtxos();
  const networkMode = useBitcoinLibNetworkConfig();
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();

  const broadcastTx = useBitcoinBroadcastTransaction();

  const totalAmount = sumNumbers(uninscribedUtxos.map(utxo => utxo.value));

  const fee = useMemo(() => {
    if (!feeRate) return createMoney(0, 'BTC');
    const txSizer = new BtcSizeFeeEstimator();
    const { txVBytes } = txSizer.calcTxSize({
      input_count: uninscribedUtxos.length,
      p2wpkh_output_count: 1,
    });
    return createMoney(Math.ceil(txVBytes * feeRate.hourFee), 'BTC');
  }, [feeRate, uninscribedUtxos.length]);

  async function generateRetrievalTransaction() {
    setIsLoading(true);

    const tx = new btc.Transaction();

    uninscribedUtxos.forEach(utxo => {
      const signer = createSigner(utxo.addressIndex);
      tx.addInput({
        txid: utxo.txid,
        index: utxo.vout,
        tapInternalKey: signer.payment.tapInternalKey,
        witnessUtxo: {
          script: signer.payment.script,
          amount: BigInt(utxo.value),
        },
      });
    });

    const zeroInscriptionCheckResults = await Promise.all(
      uninscribedUtxos.map(utxo => getNumberOfInscriptionOnUtxo(utxo.txid, utxo.vout))
    );

    if (!zeroInscriptionCheckResults.every(inscriptionCount => inscriptionCount === 0)) {
      throw new Error('Inscription found in utxos');
    }

    const paymentAmount = BigInt(totalAmount.minus(fee.amount.toString()).toString());

    tx.addOutputAddress(nativeSegwitRecipient, paymentAmount, networkMode);

    uninscribedUtxos.forEach(utxo => createSigner(utxo.addressIndex).sign(tx));

    tx.finalize();
    return tx.hex;
  }

  async function handleBroadcastRetieveBitcoinTx() {
    setIsLoading(true);
    const tx = await generateRetrievalTransaction();
    try {
      const resp = await broadcastTx(tx);
      await delay(1200);
      // eslint-disable-next-line no-console
      console.log(resp);
      toast.success('Transaction broadcasted succesfully');
      await delay(700);
      navigate(RouteUrls.Home);
      setActiveTabActivity();
      void analytics.track('broadcast_retrieve_taproot_to_native_segwit');
    } catch (e) {
      alert(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <RetrieveTaprootToNativeSegwitLayout balance={balance} onClose={() => navigate(RouteUrls.Home)}>
      <InfoCard mt="loose">
        <Stack width="100%">
          <InfoCardRow title="Your address" value={nativeSegwitRecipient} isAddressDisplayer />
          <InfoCardSeparator />
          <InfoCardRow title="Amount" value={formatMoneyPadded(balance)} />
          <InfoCardRow title="Fee" value={formatMoneyPadded(fee)} />
          <InfoCardSeparator />
          {uninscribedUtxos.map((utxo, i) => (
            <InfoCardRow
              key={utxo.txid}
              title={`Uninscribed UTXO #${i}`}
              value={
                <ExternalLink href={`https://ordinals.com/output/${utxo.txid}:${utxo.vout}`}>
                  {`${truncateMiddle(utxo.txid, 4)}:${utxo.vout}`} ↗
                </ExternalLink>
              }
            />
          ))}
        </Stack>
      </InfoCard>
      <WarningLabel mt="loose">
        We recommend you check the UTXOs to ensure they contain no inscriptions
      </WarningLabel>
      <PrimaryButton
        onClick={handleBroadcastRetieveBitcoinTx}
        isLoading={isLoading}
        width="100%"
        my="loose"
      >
        Retreive bitcoin
      </PrimaryButton>
    </RetrieveTaprootToNativeSegwitLayout>
  );
}
