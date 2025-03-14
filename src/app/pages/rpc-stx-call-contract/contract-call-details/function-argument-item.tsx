import { type ClarityValue, cvToString, getCVTypeString } from '@stacks/transactions';

import { Row } from '@app/features/stacks-transaction-request/row';

interface FunctionArgumentItemProps {
  arg: ClarityValue;
  name: string;
}
export function FunctionArgumentItem({ arg, name }: FunctionArgumentItemProps) {
  const strValue = cvToString(arg);
  return <Row name={name} type={getCVTypeString(arg)} value={strValue} />;
}
