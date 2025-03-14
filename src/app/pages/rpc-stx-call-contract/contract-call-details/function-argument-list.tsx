import type { ClarityAbiFunction, ClarityValue } from '@stacks/transactions';
import { Stack } from 'leather-styles/jsx';

import { Caption } from '@leather.io/ui';

import { FunctionArgumentItem } from './function-argument-item';

interface FunctionArgumentListProps {
  fn: ClarityAbiFunction;
  fnArgs: ClarityValue[];
}
export function FunctionArgumentList({ fn, fnArgs }: FunctionArgumentListProps) {
  return (
    <>
      {fnArgs.length > 0 ? (
        <Stack gap="space.04">
          {fnArgs.map((arg, i) => {
            const argName = fn.args[i].name;
            return <FunctionArgumentItem key={i} arg={arg} name={argName} />;
          })}
        </Stack>
      ) : (
        <Caption>There are no additional arguments.</Caption>
      )}
    </>
  );
}
