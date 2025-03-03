import { useEffect, useState } from 'react';

import { isDefined } from '@leather.io/utils';

import type { EditorFee, EditorFees } from './fee-editor.context';

interface UseFeeEditorArgs {
  editorFees: EditorFees;
  getCustomEditorFee(rate: number): EditorFee;
}
export function useFeeEditor({ editorFees, getCustomEditorFee }: UseFeeEditorArgs) {
  const [currentEditorFee, setCurrentEditorFee] = useState<EditorFee | null>(
    editorFees?.standard ?? null
  );
  const [selectedEditorFee, setSelectedEditorFee] = useState<EditorFee | null>(currentEditorFee);
  const [customEditorFeeRate, setCustomEditorFeeRate] = useState<string>('');

  useEffect(() => {
    if (isDefined(editorFees) && !currentEditorFee) {
      setCurrentEditorFee(editorFees.standard);
    }
  }, [currentEditorFee, editorFees]);

  useEffect(() => {
    if (
      isDefined(editorFees) &&
      selectedEditorFee &&
      customEditorFeeRate === '' &&
      selectedEditorFee?.type !== 'custom'
    ) {
      const data = editorFees[selectedEditorFee.type];
      if (data.feeRate) setCustomEditorFeeRate(data.feeRate.toString());
    }
  }, [editorFees, selectedEditorFee, customEditorFeeRate]);

  const customEditorFee = getCustomEditorFee(Number(customEditorFeeRate));

  return {
    editorFees,
    currentEditorFee,
    customEditorFee,
    customEditorFeeRate,
    selectedEditorFee,
    getCustomEditorFee,
    onSetCurrentEditorFee: (value: EditorFee) => setCurrentEditorFee(value),
    onSetCustomEditorFeeRate: (value: string) => setCustomEditorFeeRate(value),
    onSetSelectedEditorFee: (value: EditorFee) => setSelectedEditorFee(value),
  };
}
