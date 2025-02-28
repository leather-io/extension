import { useNavigate } from 'react-router-dom';

import { Center, styled } from 'leather-styles/jsx';

import { Approver, Button } from '@leather.io/ui';

import { Fees } from '@app/features/fee-editor/components/fees';
import { formatFeeForDisplay } from '@app/features/fee-editor/fee-editor.utils';

import { type RawFee, useFeeEditorContext } from './fee-editor.context';

export function FeeEditor() {
  const {
    availableBalance,
    customFeeRate,
    editFeeSelected,
    marketData,
    rawFees,
    selectedFeeData,
    selectedFeeType,
    getCustomFeeData,
    onSetCustomFeeRate,
    onSetEditFeeSelected,
    onSetSelectedFeeType,
  } = useFeeEditorContext();
  const navigate = useNavigate();

  const insufficientBalance = availableBalance.amount.isLessThan(
    selectedFeeData?.baseUnitsValue ?? 0
  );

  function onCancel() {
    navigate(-1);
    onSetCustomFeeRate(selectedFeeData?.feeRate.toString() || '');
    onSetEditFeeSelected(selectedFeeType);
  }

  function onSave() {
    onSetSelectedFeeType(editFeeSelected);
    if (editFeeSelected !== 'custom') {
      onSetCustomFeeRate(selectedFeeData?.feeRate.toString() || '');
    }
    navigate(-1);
  }

  function getFeeItemProps(rawFee: RawFee) {
    const { type } = rawFee;

    const { feeType, titleLeft, captionLeft, titleRight, captionRight } = formatFeeForDisplay({
      rawFee,
      marketData,
    });

    return {
      feeType,
      isSelected: editFeeSelected === type,
      isInsufficientBalance: insufficientBalance,
      titleLeft,
      captionLeft,
      titleRight,
      captionRight,
      onSelect: () => onSetEditFeeSelected(type),
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
          <Fees.Item {...getFeeItemProps(rawFees.slow)} />
          <Fees.Item {...getFeeItemProps(rawFees.standard)} />
          <Fees.Item {...getFeeItemProps(rawFees.fast)} />

          <Fees.CustomItem
            {...getFeeItemProps(getCustomFeeData(Number(customFeeRate)))}
            fee={customFeeRate}
            setFee={onSetCustomFeeRate}
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
