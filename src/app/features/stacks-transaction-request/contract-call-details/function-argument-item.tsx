import { cvToString, deserializeCV, getCVTypeString } from '@stacks/transactions';

import { Row } from '@app/features/stacks-transaction-request/row';
import { useContractFunction } from '@app/query/stacks/contract/contract.hooks';

interface FunctionArgumentProps {
  arg: string;
  index: number;
}

export function FunctionArgumentItem(props: FunctionArgumentProps): React.JSX.Element {
  const { arg, index, ...rest } = props;
  const contractFunction = useContractFunction();
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);

  return (
    <Row
      name={<>{contractFunction?.args[index].name || 'unknown'}</>}
      type={getCVTypeString(argCV)}
      value={strValue}
      {...rest}
    />
  );
}
