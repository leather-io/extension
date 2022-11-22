import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { Box, Button, Flex, Input, color } from '@stacks/ui';
import { OnboardingSelectors } from '@tests-legacy/integration/onboarding/onboarding.selectors';
import { useField } from 'formik';

import { ValidatedPassword } from '@app/common/validation/validate-password';
import { Caption } from '@app/components/typography';

import { getIndicatorsOfPasswordStrength } from './password-field.utils';
import { PasswordStrengthIndicator } from './password-strength-indicator';

interface PasswordFieldProps {
  strengthResult: ValidatedPassword;
  isDisabled: boolean;
}
export function PasswordField({ strengthResult, isDisabled }: PasswordFieldProps) {
  const [field] = useField('password');
  const [showPassword, setShowPassword] = useState(false);

  const { strengthColor, strengthText } = getIndicatorsOfPasswordStrength(strengthResult);

  return (
    <>
      <Box position="relative">
        <Input
          _focus={{ border: '2px solid #5546FF' }}
          autoFocus
          border="2px solid"
          data-testid={OnboardingSelectors.NewPasswordInput}
          height="64px"
          key="password-input"
          placeholder="Set a password"
          type={showPassword ? 'text' : 'password'}
          isDisabled={isDisabled}
          {...field}
        />
        <Button
          _focus={{ bg: 'transparent', boxShadow: 'none' }}
          _hover={{ bg: 'transparent', boxShadow: 'none' }}
          bg="transparent"
          boxShadow="none"
          color={color('text-title')}
          height="20px"
          onClick={() => setShowPassword(!showPassword)}
          position="absolute"
          right="base"
          top="20px"
          transform="matrix(-1, 0, 0, 1, 0, 0)"
          type="button"
          width="20px"
        >
          {showPassword ? <FiEyeOff size="20px" /> : <FiEye size="20px" />}
        </Button>
      </Box>
      <PasswordStrengthIndicator strengthColor={strengthColor} strengthResult={strengthResult} />
      <Flex alignItems="center">
        <Caption mx="extra-tight">Password strength:</Caption>
        <Caption>{field.value ? strengthText : '—'}</Caption>
      </Flex>
    </>
  );
}
