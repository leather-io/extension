import { useMemo, useState } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { useField } from 'formik';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { ValidatedPassword } from '@app/common/validation/validate-password';
import { EyeIcon } from '@app/ui/components/icons/eye-icon';
import { EyeSlashIcon } from '@app/ui/components/icons/eye-slash-icon';
import { Input } from '@app/ui/components/input/input';
import { Caption } from '@app/ui/components/typography/caption';

import { getIndicatorsOfPasswordStrength } from './password-field.utils';
import { PasswordStrengthIndicator } from './password-strength-indicator';

interface PasswordFieldProps {
  strengthResult: ValidatedPassword;
  isDisabled: boolean;
}
export function PasswordField({ strengthResult, isDisabled }: PasswordFieldProps) {
  const [field] = useField('password');
  const [showPassword, setShowPassword] = useState(false);

  const { strengthColor, strengthText } = useMemo(
    () => getIndicatorsOfPasswordStrength(strengthResult),
    [strengthResult]
  );

  return (
    <>
      <Box position="relative">
        <Input.Root>
          <Input.Label>Password</Input.Label>
          <Input.Field
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
            data-testid={OnboardingSelectors.NewPasswordInput}
            disabled={isDisabled}
            key="password-input"
            type={showPassword ? 'text' : 'password'}
            width="100%"
            {...field}
          />
        </Input.Root>
        <styled.button
          _focus={{ bg: 'transparent', outline: 'none' }}
          _hover={{ bg: 'transparent', outline: 'none' }}
          bg="transparent"
          appearance="none"
          height="20px"
          onClick={() => setShowPassword(!showPassword)}
          position="absolute"
          right="space.04"
          top="22px"
          type="button"
          width="20px"
          zIndex={10}
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </styled.button>
      </Box>
      <PasswordStrengthIndicator
        password={field.value}
        strengthColor={strengthColor}
        strengthResult={strengthResult}
      />
      <Flex alignItems="center">
        <Caption mr="space.02">Password strength:</Caption>
        <Caption>{field.value ? strengthText : '—'}</Caption>
      </Flex>
    </>
  );
}
