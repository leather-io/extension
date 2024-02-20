import { token } from 'leather-styles/tokens';

import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

export const defaultColor = token('colors.ink.background-secondary');

const strengthStyles = {
  [PasswordStrength.NoScore]: {
    strengthColor: token('colors.red.action-primary-default'),
    strengthText: 'Poor',
  },
  [PasswordStrength.PoorScore]: {
    strengthColor: token('colors.red.action-primary-default'),
    strengthText: 'Poor',
  },
  [PasswordStrength.WeakScore]: {
    strengthColor: token('colors.yellow.action-primary-default'),
    strengthText: 'Weak',
  },
  [PasswordStrength.AverageScore]: {
    strengthColor: token('colors.yellow.action-primary-default'),
    strengthText: 'Average',
  },
  [PasswordStrength.StrongScore]: {
    strengthColor: token('colors.yellow.action-primary-default'),
    strengthText: 'Average',
  },
  [PasswordStrength.MeetsAllRequirements]: {
    strengthColor: token('colors.green.action-primary-default'),
    strengthText: 'Strong',
  },
};

export function getIndicatorsOfPasswordStrength(result: ValidatedPassword) {
  if (result.meetsAllStrengthRequirements)
    return strengthStyles[PasswordStrength.MeetsAllRequirements];
  return strengthStyles[result.score];
}
