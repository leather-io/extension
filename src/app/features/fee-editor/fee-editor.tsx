import { useNavigate } from 'react-router-dom';

import { Center, Stack, styled } from 'leather-styles/jsx';

import { Approver, Button } from '@leather.io/ui';

import { CurrentFeeItem } from './components/current-fee-item';
import { CustomFeeItem } from './components/custom-fee-item';
import { DefaultFeesList } from './components/default-fees-list';
import { FeeItem } from './components/fee-item';
import { useFeeEditorContext } from './fee-editor.context';

interface FeeEditorProps {
  children?: React.ReactNode;
}
function FeeEditor({ children }: FeeEditorProps) {
  const {
    currentEditorFee,
    customEditorFeeRate,
    isLoadingFees,
    editorFees,
    selectedEditorFee,
    getCustomEditorFee,
    onSetCurrentEditorFee,
    onSetCustomEditorFeeRate,
    onSetSelectedEditorFee,
  } = useFeeEditorContext();
  const navigate = useNavigate();

  function onCancel() {
    onSetCustomEditorFeeRate(selectedEditorFee?.feeRate?.toString() || '');
    onSetSelectedEditorFee(currentEditorFee);
    navigate(-1);
  }

  function onSave() {
    const isCustomFee = selectedEditorFee?.type === 'custom';
    onSetCurrentEditorFee(
      isCustomFee ? getCustomEditorFee(Number(customEditorFeeRate)) : selectedEditorFee
    );
    if (!isCustomFee) {
      onSetCustomEditorFeeRate(selectedEditorFee?.feeRate?.toString() || '');
    }
    navigate(-1);
  }

  if (isLoadingFees || !editorFees) return null;

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
FeeEditor.Trigger = CurrentFeeItem;

export { FeeEditor };
