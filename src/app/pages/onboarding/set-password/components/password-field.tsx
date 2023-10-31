import { useMemo, useState } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { useField } from 'formik';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { ValidatedPassword } from '@app/common/validation/validate-password';
import { EyeIcon } from '@app/ui/components/icons/eye-icon';
import { EyeSlashIcon } from '@app/ui/components/icons/eye-slash-icon';
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
        <styled.input
          _focus={{ border: 'focus' }}
          autoCapitalize="off"
          autoComplete="off"
          autoFocus
          border="active"
          borderRadius="10px"
          data-testid={OnboardingSelectors.NewPasswordInput}
          disabled={isDisabled}
          height="64px"
          key="password-input"
          p="space.04"
          placeholder="Set a password"
          ring="none"
          type={showPassword ? 'text' : 'password'}
          textStyle="body.02"
          width="100%"
          {...field}
        />
        <styled.button
          _focus={{ bg: 'transparent', boxShadow: 'none' }}
          _hover={{ bg: 'transparent', boxShadow: 'none' }}
          bg="transparent"
          boxShadow="none"
          height="20px"
          onClick={() => setShowPassword(!showPassword)}
          position="absolute"
          right="space.04"
          top="20px"
          transform="matrix(-1, 0, 0, 1, 0, 0)"
          type="button"
          width="20px"
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
        <Caption mx="space.04">Password strength:</Caption>
        <Caption>{field.value ? strengthText : '—'}</Caption>
      </Flex>
    </>
  );
}
