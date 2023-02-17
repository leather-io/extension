export function createDefaultInitialFormValues<T extends Record<string, unknown>>(obj: T) {
  return { amount: '', recipient: '', ...obj };
}

export const defaultSendFormFormikProps = {
  validateOnChange: false,
  validateOnMount: false,
} as const;
