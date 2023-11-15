import { PasswordStrength, ValidatedPassword } from '@app/common/validation/validate-password';

export const defaultColor = 'accent.background-secondary';

const strengthStyles = {
  [PasswordStrength.NoScore]: {
    strengthColor: 'error.label',
    strengthText: 'Poor',
  },
  [PasswordStrength.PoorScore]: {
    strengthColor: 'error.label',
    strengthText: 'Poor',
  },
  [PasswordStrength.WeakScore]: {
    strengthColor: 'warning.label',
    strengthText: 'Weak',
  },
  [PasswordStrength.AverageScore]: {
    strengthColor: 'warning.label',
    strengthText: 'Average',
  },
  [PasswordStrength.StrongScore]: {
    strengthColor: 'warning.label',
    strengthText: 'Average',
  },
  [PasswordStrength.MeetsAllRequirements]: {
    strengthColor: 'success.label',
    strengthText: 'Strong',
  },
};

export function getIndicatorsOfPasswordStrength(result: ValidatedPassword) {
  if (result.meetsAllStrengthRequirements)
    return strengthStyles[PasswordStrength.MeetsAllRequirements];
  return strengthStyles[result.score];
}
