import { Center, Stack, styled } from 'leather-styles/jsx';

import { Approver, Button } from '@leather.io/ui';

import { useOnMount } from '@app/common/hooks/use-on-mount';

import { CustomFeeItem } from './components/custom-fee-item';
import { DefaultFeesList } from './components/default-fees-list';
import { FeeItem } from './components/fee-item';
import { SelectedFeeItem } from './components/selected-fee-item';
import { useFeeEditorContext } from './fee-editor.context';

interface FeeEditorProps {
  children?: React.ReactNode;
}
function FeeEditor({ children }: FeeEditorProps) {
  const {
    customFeeRate,
    loadedFee,
    isLoadingFees,
    fees,
    selectedFee,
    getCustomFee,
    onGoBack,
    onSetCustomFeeRate,
    onSetLoadedFee,
    onSetSelectedFee,
  } = useFeeEditorContext();

  useOnMount(() => {
    onSetLoadedFee(selectedFee);
  });

  function onCancel() {
    // Reset if user cancels
    onSetCustomFeeRate(selectedFee?.feeRate?.toString() || '');
    onSetSelectedFee(loadedFee);
    onGoBack();
  }

  function onSave() {
    // Need to handle custom fee input change on save
    const isCustomFee = selectedFee?.type === 'custom';
    if (isCustomFee) onSetSelectedFee(getCustomFee(Number(customFeeRate)));
    if (!isCustomFee) {
      onSetCustomFeeRate(selectedFee?.feeRate?.toString() || '');
    }
    onGoBack();
  }

  if (isLoadingFees || !fees) return null;

  return (
    <Approver height="100%" width="100%" requester={origin}>
      <Approver.Section mt="0" py="space.05">
        <Center>
          <styled.span textStyle="heading.05">Edit fee</styled.span>
        </Center>
      </Approver.Section>
      <Approver.Section>
        <Stack gap="space.03">{children ? children : <DefaultFeesList />}</Stack>
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

FeeEditor.FeeItem = FeeItem;
FeeEditor.CustomFeeItem = CustomFeeItem;
FeeEditor.Trigger = SelectedFeeItem;

export { FeeEditor };
