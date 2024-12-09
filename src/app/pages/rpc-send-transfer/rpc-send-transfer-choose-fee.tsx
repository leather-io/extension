import { useNavigate } from 'react-router-dom';

import { Center } from 'leather-styles/jsx';

import { Approver, Button } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { type RawFee } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-data';
import type { FeeItemProps } from '@app/components/fees/fee-item';
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
    formatFeeForDisplay,
  } = useRpcSendTransferState();
  const navigate = useNavigate();

  const btcBalance = useCurrentBtcCryptoAssetBalanceNativeSegwit();

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

  function getFeeItemProps(rawFee: RawFee): FeeItemProps {
    const { type } = rawFee;

    const humanFee = formatFeeForDisplay(rawFee);
    const isInsufficientBalance = btcBalance.balance.availableBalance.amount.isLessThan(
      humanFee.baseUnitsValue
    );

    return {
      feeType: type,
      isSelected: editFeeSelected === type,
      isInsufficientBalance,
      onSelect: () => {
        setEditFeeSelected(type);
      },
      titleLeft: humanFee.titleLeft,
      captionLeft: humanFee.captionLeft,
      titleRight: humanFee.titleRight,
      captionRight: humanFee.captionRight,
    };
  }

  return (
    <Approver height="100%" width="100%" requester={origin}>
      <Approver.Section>
        <Approver.Subheader justifyContent="center" mb="0">
          <Center>Edit Fee</Center>
        </Approver.Subheader>
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
            Cancel
          </Button>,
          <Button key="save" onClick={onSave} fullWidth>
            Save
          </Button>,
        ]}
      />
    </Approver>
  );
}
