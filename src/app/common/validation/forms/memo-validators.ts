import { MEMO_MAX_LENGTH_BYTES } from '@stacks/transactions';
import * as yup from 'yup';

import { isString } from '@leather.io/utils';

const exceedsMaxLengthBytes = (string: string, maxLengthBytes: number): boolean =>
  string ? Buffer.from(string).length > maxLengthBytes : false;

function isTxMemoValid(memo: string) {
  return !exceedsMaxLengthBytes(memo, MEMO_MAX_LENGTH_BYTES);
}

export function stxMemoValidator(errorMsg: string) {
  return yup.string().test({
    message: errorMsg,
    test(value: unknown) {
      if (!isString(value)) return true;
      return isTxMemoValid(value);
    },
  });
}
