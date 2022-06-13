import { color } from '@stacks/ui';

import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

export const defaultColor = '#EFEFF2';

const strengthStyles = {
  [PasswordStrength.NoScore]: {
    strengthColor: color('feedback-error'),
    strengthText: 'Poor',
  },
  [PasswordStrength.PoorScore]: {
    strengthColor: color('feedback-error'),
    strengthText: 'Poor',
  },
  [PasswordStrength.WeakScore]: {
    strengthColor: color('feedback-alert'),
    strengthText: 'Weak',
  },
  [PasswordStrength.AverageScore]: {
    strengthColor: '#F0C000',
    strengthText: 'Average',
  },
  [PasswordStrength.StrongScore]: {
    strengthColor: '#F0C000',
    strengthText: 'Average',
  },
  [PasswordStrength.MeetsAllRequirements]: {
    strengthColor: color('feedback-success'),
    strengthText: 'Strong',
  },
};

export function getIndicatorsOfPasswordStrength(result: ValidatedPassword) {
  if (result.meetsAllStrengthRequirements)
    return strengthStyles[PasswordStrength.MeetsAllRequirements];
  return strengthStyles[result.score];
}
