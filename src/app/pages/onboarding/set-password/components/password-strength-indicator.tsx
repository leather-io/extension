import { useMemo } from 'react';
import { Box, Stack } from '@stacks/ui';

import { ValidatedPassword } from '@app/common/validation/validate-password';

import { defaultColor } from './password-field.utils';

function fillArray(amount: number) {
  return (item: JSX.Element) =>
    Array(amount)
      .fill(null)
      .map(() => item);
}

interface PasswordStrengthIndicatorProps {
  strengthColor: string;
  strengthResult: ValidatedPassword;
}
export function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps) {
  const { strengthColor, strengthResult } = props;

  const bars = useMemo(() => {
    if (strengthResult.password.trim() === '')
      return fillArray(4)(<Box bg={defaultColor} borderRadius="2px" flexGrow={1} />);

    return [
      ...fillArray(Math.max(strengthResult.score, 1))(
        <Box bg={strengthColor} borderRadius="2px" flexGrow={1} />
      ),
      ...fillArray(4 - Math.max(strengthResult.score, 1))(
        <Box bg={defaultColor} borderRadius="2px" flexGrow={1} />
      ),
    ];
  }, [strengthColor, strengthResult.password, strengthResult.score]);

  return (
    <Stack height="6px" isInline>
      {bars}
    </Stack>
  );
}
