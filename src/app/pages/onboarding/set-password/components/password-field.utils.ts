import { token } from 'leather-styles/tokens';

import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

export const defaultColor = token('colors.accent.background-secondary');

const strengthStyles = {
  [PasswordStrength.NoScore]: {
    strengthColor: token('colors.error.label'),
    strengthText: 'Poor',
  },
  [PasswordStrength.PoorScore]: {
    strengthColor: token('colors.error.label'),
    strengthText: 'Poor',
  },
  [PasswordStrength.WeakScore]: {
    strengthColor: token('colors.warning.label'),
    strengthText: 'Weak',
  },
  [PasswordStrength.AverageScore]: {
    strengthColor: token('colors.warning.label'),
    strengthText: 'Average',
  },
  [PasswordStrength.StrongScore]: {
    strengthColor: token('colors.warning.label'),
    strengthText: 'Average',
  },
  [PasswordStrength.MeetsAllRequirements]: {
    strengthColor: token('colors.success.label'),
    strengthText: 'Strong',
  },
};

export function getIndicatorsOfPasswordStrength(result: ValidatedPassword) {
  if (result.meetsAllStrengthRequirements)
    return strengthStyles[PasswordStrength.MeetsAllRequirements];
  return strengthStyles[result.score];
}
