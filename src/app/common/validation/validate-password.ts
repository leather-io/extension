import zxcvbn, { ZXCVBNResult, ZXCVBNScore } from 'zxcvbn';

const truncateCpuDemandingPassword = (input: string) => input.slice(0, 100);

export enum PasswordStrength {
  NoScore,
  PoorScore,
  WeakScore,
  AverageScore,
  StrongScore,
  MeetsAllRequirements,
}

const requiredStrengthScore: ZXCVBNScore = PasswordStrength.StrongScore;

const requiredPasswordLength = 12;

function hasHighestPasswordScore(score: ZXCVBNScore) {
  return score >= requiredStrengthScore;
}

function hasSufficientLength(input: string) {
  return input.length >= requiredPasswordLength;
}

export interface ValidatedPassword extends ZXCVBNResult {
  meetsLengthRequirement: boolean;
  meetsScoreRequirement: boolean;
  meetsAllStrengthRequirements: boolean;
  password: string;
}

export function validatePassword(input: string): ValidatedPassword {
  const password = input.length > 100 ? truncateCpuDemandingPassword(input) : input;
  const result = zxcvbn(password);
  const meetsScoreRequirement = hasHighestPasswordScore(result.score);
  const meetsLengthRequirement = hasSufficientLength(input);
  const meetsAllStrengthRequirements = meetsScoreRequirement && meetsLengthRequirement;

  return Object.freeze({
    ...result,
    meetsScoreRequirement,
    meetsLengthRequirement,
    meetsAllStrengthRequirements,
    password,
  });
}

export const blankPasswordValidation = Object.freeze(validatePassword(''));
