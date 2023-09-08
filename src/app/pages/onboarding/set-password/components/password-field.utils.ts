import { token } from 'leather-styles/tokens';

import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

export const defaultColor = '#EFEFF2';

const strengthStyles = {
  [PasswordStrength.NoScore]: {
    strengthColor: token('colors.error'),
    strengthText: 'Poor',
  },
  [PasswordStrength.PoorScore]: {
    strengthColor: token('colors.error'),
    strengthText: 'Poor',
  },
  [PasswordStrength.WeakScore]: {
    strengthColor: token('colors.yellow.100'), // feedback-alert // #4164 FIXME replace need to fix this and check
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
    strengthColor: token('colors.green.100'), // feedback-success  // #4164 FIXME replace need to fix this and check
    strengthText: 'Strong',
  },
};

export function getIndicatorsOfPasswordStrength(result: ValidatedPassword) {
  if (result.meetsAllStrengthRequirements)
    return strengthStyles[PasswordStrength.MeetsAllRequirements];
  return strengthStyles[result.score];
}
