import { useFeeEditorContext } from '../fee-editor.context';
import { CustomFeeItem } from './custom-fee-item';
import { FeeItem } from './fee-item';

export function DefaultFeesList() {
  const { customFeeRate, fees, getCustomFee } = useFeeEditorContext();
  if (!fees) return null;
  return (
    <>
      <FeeItem fee={fees.slow} />
      <FeeItem fee={fees.standard} />
      <FeeItem fee={fees.fast} />
      <CustomFeeItem fee={getCustomFee(Number(customFeeRate))} />
    </>
  );
}
