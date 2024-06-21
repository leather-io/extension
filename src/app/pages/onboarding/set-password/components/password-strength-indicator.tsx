import { useMemo } from 'react';

import { createNullArrayOfLength } from '@leather.io/utils';

import { ValidatedPassword } from '@app/common/validation/validate-password';

import { PasswordStrengthBars } from './password-bars';
import { defaultColor } from './password-field.utils';

function fillArray(amount: number) {
  return (item: (i: number) => string) => createNullArrayOfLength(amount).map((_, i) => item(i));
}

interface PasswordStrengthIndicatorProps {
  password: string;
  strengthColor: string;
  strengthResult: ValidatedPassword;
}
export function PasswordStrengthIndicator({
  password,
  strengthColor,
  strengthResult,
}: PasswordStrengthIndicatorProps) {
  const bars = useMemo(() => {
    if (strengthResult.password.trim() === '' || password.trim() === '')
      return fillArray(4)(() => defaultColor);

    if (strengthResult.score === 4 && !strengthResult.meetsAllStrengthRequirements) {
      return [...fillArray(3)(() => strengthColor), ...fillArray(1)(() => defaultColor)];
    }

    return [
      ...fillArray(Math.max(strengthResult.score, 1))(() => strengthColor),
      ...fillArray(4 - Math.max(strengthResult.score, 1))(() => defaultColor),
    ];
  }, [
    password,
    strengthColor,
    strengthResult.meetsAllStrengthRequirements,
    strengthResult.password,
    strengthResult.score,
  ]);

  return <PasswordStrengthBars bars={bars} />;
}
