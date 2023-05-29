import BigNumber from 'bignumber.js';
import * as yup from 'yup';

interface Brc20TransferInscription {
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
    .test(value => new BigNumber(value).isFinite())
    .test(value => new BigNumber(value).isInteger()),
});

function validateBrc20TransferInscription(val: unknown): val is Brc20TransferInscription {
  return brc20TransferInscriptionSchema.isValidSync(val);
}

// ts-unused-exports:disable-next-line
export function createBrc20TransferInscription(tick: string, amt: string) {
  const transfer: Brc20TransferInscription = {
    p: 'brc-20',
    op: 'transfer',
    tick,
    amt,
  };

  if (!validateBrc20TransferInscription(transfer)) throw new Error('Invalid transfer inscription');

  return transfer;
}
