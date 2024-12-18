import { useNavigate } from 'react-router-dom';

import { Center, styled } from 'leather-styles/jsx';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { Approver, Button } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { type RawFee } from '@app/components/bitcoin-fees-list/bitcoin-fees.utils';
import { formatBitcoinFeeForDisplay } from '@app/components/bitcoin-fees-list/format-bitcoin-fee';
import { Fees } from '@app/components/fees/fees';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';

import { useRpcSendTransferState } from './rpc-send-transfer-container';

export function RpcSendTransferChooseFee() {
  const {
    fees,
    selectedFeeType,
    setSelectedFeeType,
    editFeeSelected,
    setEditFeeSelected,
    selectedFeeData,
    customFeeRate,
    setCustomFeeRate,
    getCustomFeeData,
  } = useRpcSendTransferState();
  const navigate = useNavigate();
  const btcMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();
  const insufficientBalance = btcBalance.balance.availableBalance.amount.isLessThan(
    selectedFeeData?.baseUnitsValue ?? 0
  );

  function onCancel() {
    navigate(RouteUrls.RpcSendTransfer);
    setCustomFeeRate(selectedFeeData?.feeRate.toString() || '');
    setEditFeeSelected(selectedFeeType);
  }

  function onSave() {
    setSelectedFeeType(editFeeSelected);
    if (editFeeSelected !== 'custom') {
      setCustomFeeRate(selectedFeeData?.feeRate.toString() || '');
    }
    navigate(RouteUrls.RpcSendTransfer);
  }

  function getFeeItemProps(rawFee: RawFee) {
    const { type } = rawFee;

    const { feeType, titleLeft, captionLeft, titleRight, captionRight } =
      formatBitcoinFeeForDisplay({ rawFee, marketData: btcMarketData });

    return {
      feeType,
      isSelected: editFeeSelected === type,
      isInsufficientBalance: insufficientBalance,
      onSelect: () => {
        setEditFeeSelected(type);
      },
      titleLeft,
      captionLeft,
      titleRight,
      captionRight,
    };
  }

  return (
    <Approver height="100%" width="100%" requester={origin}>
      <Approver.Section mt="0" py="space.05">
        <Center>
          <styled.span textStyle="heading.05">Edit fee</styled.span>
        </Center>
      </Approver.Section>

      <Approver.Section>
        <Fees>
          <Fees.Item {...getFeeItemProps(fees.slow)} />
          <Fees.Item {...getFeeItemProps(fees.standard)} />
          <Fees.Item {...getFeeItemProps(fees.fast)} />

          <Fees.CustomItem
            {...getFeeItemProps(getCustomFeeData(Number(customFeeRate)))}
            fee={customFeeRate}
            setFee={setCustomFeeRate}
          />
        </Fees>
      </Approver.Section>

      <Approver.Actions
        actions={[
          <Button key="cancel" onClick={onCancel} fullWidth variant="outline">
            Back
          </Button>,
          <Button key="save" onClick={onSave} fullWidth>
            Save
          </Button>,
        ]}
      />
    </Approver>
  );
}
