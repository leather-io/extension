import { useFeeEditorContext } from '../fee-editor.context';
import { CustomFeeItem } from './custom-fee-item';
import { FeeItem } from './fee-item';

export function DefaultFeesList() {
  const { customEditorFeeRate, editorFees, getCustomEditorFee } = useFeeEditorContext();
  if (!editorFees) return null;
  return (
    <>
      <FeeItem fee={editorFees.slow} />
      <FeeItem fee={editorFees.standard} />
      <FeeItem fee={editorFees.fast} />
      <CustomFeeItem fee={getCustomEditorFee(Number(customEditorFeeRate))} />
    </>
  );
}
