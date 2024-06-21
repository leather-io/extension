import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Form, Formik } from 'formik';
import { Stack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';
import { createNullArrayOfLength, isEmpty } from '@leather.io/utils';

import { ErrorLabel } from '@app/components/error-label';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';
import { MnemonicWordInput } from '@app/ui/components/secret-key/mnemonic-key/mnemonic-word-input';
import {
  getMnemonicErrorFields,
  getMnemonicErrorMessage,
  hasMnemonicFormValues,
} from '@app/ui/components/secret-key/mnemonic-key/utils/error-handling';
import { validationSchema } from '@app/ui/components/secret-key/mnemonic-key/utils/validation';
import { SecretKeyGrid } from '@app/ui/components/secret-key/secret-key-grid';

interface MnemonicFormProps {
  mnemonic: (string | null)[];
  setMnemonic(mnemonic: (string | null)[]): void;
  twentyFourWordMode: boolean;
}
export function MnemonicForm({ mnemonic, setMnemonic, twentyFourWordMode }: MnemonicFormProps) {
  const { submitMnemonicForm, error, isLoading } = useSignIn();

  function mnemonicWordUpdate(index: number, word: string) {
    const newMnemonic = [...mnemonic];
    newMnemonic[index] = word;
    setMnemonic(newMnemonic);
  }

  function updateEntireKey(key: string, setFieldValue: (name: string, value: number) => void) {
    const newKey = key.split(' ');
    newKey.map((index, value) => setFieldValue(`${index + 1}`, value));
    setMnemonic(newKey);
    void submitMnemonicForm(key);
  }

  function handleSubmit() {
    return void submitMnemonicForm(mnemonic.join(' '));
  }

  const mnemonicFieldArray = mnemonic
    ? mnemonic
    : createNullArrayOfLength(twentyFourWordMode ? 24 : 12);

  // set initialValues to avoid throwing uncontrolled inputs error
  const initialValues = mnemonicFieldArray.reduce(
    (accumulator, _, index) => ((accumulator[`${index + 1}`] = ''), accumulator),
    {}
  );
  return (
    <Formik
      initialValues={initialValues}
      // this onSubmit is to appease Formik and is only really needed in the onClick()
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
    >
      {({ errors, touched, setFieldValue, values, isValid }) => {
        const hasFormValues = hasMnemonicFormValues(values);
        const mnemonicErrorFields = getMnemonicErrorFields(errors, touched, values);
        const showMnemonicErrors = !isEmpty(mnemonicErrorFields) && hasFormValues;
        const mnemonicErrorMessage = getMnemonicErrorMessage(mnemonicErrorFields);

        return (
          <Form>
            <Stack gap="space.05">
              <SecretKeyGrid>
                {mnemonicFieldArray.map((_, i) => (
                  <MnemonicWordInput
                    fieldNumber={i + 1}
                    key={i}
                    value={mnemonic[i] || ''}
                    onPasteEntireKey={key => {
                      (document.activeElement as HTMLInputElement).blur();
                      updateEntireKey(key, setFieldValue);
                    }}
                    onUpdateWord={w => mnemonicWordUpdate(i, w)}
                  />
                ))}
              </SecretKeyGrid>
              {(showMnemonicErrors || error) && (
                <ErrorLabel data-testid={OnboardingSelectors.SignInSeedError}>
                  {showMnemonicErrors ? mnemonicErrorMessage : error}
                </ErrorLabel>
              )}

              <Button
                data-testid={OnboardingSelectors.SignInBtn}
                aria-disabled={isLoading || showMnemonicErrors}
                disabled={isEmpty(touched) || !isValid || !hasFormValues}
                aria-busy={isLoading}
                width="100%"
                type="submit"
                variant="solid"
                onClick={e => {
                  e.preventDefault();
                  return handleSubmit();
                }}
              >
                Continue
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}
