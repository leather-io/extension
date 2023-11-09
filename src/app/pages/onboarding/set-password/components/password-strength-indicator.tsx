import { useMemo } from 'react';

import { Box, HStack } from 'leather-styles/jsx';

import { createNullArrayOfLength } from '@app/common/utils';
import { ValidatedPassword } from '@app/common/validation/validate-password';

import { defaultColor } from './password-field.utils';

function fillArray(amount: number) {
  return (item: (i: number) => React.JSX.Element) =>
    createNullArrayOfLength(amount).map((_, i) => item(i));
}

interface PasswordStrengthIndicatorProps {
  strengthColor: string;
  strengthResult: ValidatedPassword;
}
export function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps) {
  const { strengthColor, strengthResult } = props;

  const bars = useMemo(() => {
    if (strengthResult.password.trim() === '')
      return fillArray(4)(i => <Box key={i} bg={defaultColor} borderRadius="2px" flexGrow={1} />);

    if (strengthResult.score === 4 && !strengthResult.meetsAllStrengthRequirements) {
      return [
        ...fillArray(3)(i => <Box key={i} bg={strengthColor} borderRadius="2px" flexGrow={1} />),
        ...fillArray(1)(i => <Box key={i} bg={defaultColor} borderRadius="2px" flexGrow={1} />),
      ];
    }

    return [
      ...fillArray(Math.max(strengthResult.score, 1))(i => (
        <Box key={i} bg={strengthColor} borderRadius="2px" flexGrow={1} />
      )),
      ...fillArray(4 - Math.max(strengthResult.score, 1))(i => (
        <Box key={i} bg={defaultColor} borderRadius="2px" flexGrow={1} />
      )),
    ];
  }, [
    strengthColor,
    strengthResult.meetsAllStrengthRequirements,
    strengthResult.password,
    strengthResult.score,
  ]);

  return <HStack height="6px">{bars}</HStack>;
}
