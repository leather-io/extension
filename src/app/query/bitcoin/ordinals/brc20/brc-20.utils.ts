import { utf8ToBytes } from '@noble/hashes/utils';
import { base64 } from '@scure/base';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

// ts-unused-exports:disable-next-line
export interface Brc20TransferInscription {
  p: 'brc-20';
  op: 'transfer';
  tick: string;
  amt: string;
}

const brc20TransferInscriptionSchema = yup.object({
  p: yup.string().required().equals(['brc-20']),
  op: yup.string().required().equals(['transfer']),
  tick: yup
    .string()
    .required()
    .test(value => value.length > 0 && value.length <= 4),
  amt: yup
    .string()
    .required()
    .test(value => new BigNumber(value).isFinite()),
});

function validateBrc20TransferInscription(val: unknown): val is Brc20TransferInscription {
  return brc20TransferInscriptionSchema.isValidSync(val);
}

// ts-unused-exports:disable-next-line
export function createBrc20TransferInscription(tick: string, amt: number) {
  const transfer: Brc20TransferInscription = {
    p: 'brc-20',
    op: 'transfer',
    tick,
    amt: amt.toString(),
  };

  if (!validateBrc20TransferInscription(transfer)) throw new Error('Invalid transfer inscription');

  return transfer;
}

export function encodeBrc20TransferInscription(transfer: Brc20TransferInscription) {
  const transferBytes = utf8ToBytes(JSON.stringify(transfer));
  const encodedTransfer = base64.encode(transferBytes);
  const size = transferBytes.length;
  const dataUriPrefix = 'data:plain/text;base64,';
  return { payload: dataUriPrefix + encodedTransfer, transferBytes, size };
}
