import { token } from 'leather-styles/tokens';

import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

export const defaultColor = token('colors.ink.background-secondary');

const strengthStyles = {
  [PasswordStrength.NoScore]: {
    strengthColorLightMode: token('colors.red.background-secondary'),
    strengthColorDarkMode: token('colors.red.border'),
    strengthText: 'Poor',
  },
  [PasswordStrength.PoorScore]: {
    strengthColorLightMode: token('colors.red.background-secondary'),
    strengthColorDarkMode: token('colors.red.border'),
    strengthText: 'Poor',
  },
  [PasswordStrength.WeakScore]: {
    strengthColorLightMode: token('colors.yellow.background-secondary'),
    strengthColorDarkMode: token('colors.yellow.border'),
    strengthText: 'Weak',
  },
  [PasswordStrength.AverageScore]: {
    strengthColorLightMode: token('colors.yellow.background-secondary'),
    strengthColorDarkMode: token('colors.yellow.border'),
    strengthText: 'Average',
  },
  [PasswordStrength.StrongScore]: {
    strengthColorLightMode: token('colors.yellow.background-secondary'),
    strengthColorDarkMode: token('colors.yellow.border'),
    strengthText: 'Average',
  },
  [PasswordStrength.MeetsAllRequirements]: {
    strengthColorLightMode: token('colors.green.background-secondary'),
    strengthColorDarkMode: token('colors.green.border'),
    strengthText: 'Strong',
  },
};

export function getIndicatorsOfPasswordStrength(result: ValidatedPassword) {
  if (result.meetsAllStrengthRequirements)
    return strengthStyles[PasswordStrength.MeetsAllRequirements];
  return strengthStyles[result.score];
}
