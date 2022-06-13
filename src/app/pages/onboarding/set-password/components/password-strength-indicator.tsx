import { Box, Stack } from '@stacks/ui';

import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

import { defaultColor } from './password-field.utils';

interface PasswordStrengthIndicatorProps {
  hasValue: boolean;
  strengthColor: string;
  strengthResult: ValidatedPassword;
}
export function PasswordStrengthIndicator(props: PasswordStrengthIndicatorProps) {
  const { hasValue, strengthColor, strengthResult } = props;

  return (
    <Stack height="6px" isInline>
      <Box
        bg={
          hasValue && strengthResult.score >= PasswordStrength.NoScore
            ? strengthColor
            : defaultColor
        }
        borderRadius="2px"
        flexGrow={1}
      />
      <Box
        bg={strengthResult.score >= PasswordStrength.WeakScore ? strengthColor : defaultColor}
        borderRadius="2px"
        flexGrow={1}
      />
      <Box
        bg={strengthResult.score >= PasswordStrength.AverageScore ? strengthColor : defaultColor}
        borderRadius="2px"
        flexGrow={1}
      />
      <Box
        bg={strengthResult.meetsAllStrengthRequirements ? strengthColor : defaultColor}
        borderRadius="2px"
        flexGrow={1}
      />
    </Stack>
  );
}
