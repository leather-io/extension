import { FormikErrors, FormikTouched, FormikValues } from 'formik';

export function hasMnemonicFormValues(values: FormikValues): boolean {
  return Object.values(values).filter(value => value !== '').length > 0;
}

export function getMnemonicErrorMessage(mnemonicErrorFields: string[]): string {
  return mnemonicErrorFields.length > 1
    ? `Words ${mnemonicErrorFields
        .toString()
        .replace(/,(?=[^,]+$)/, ' and')} are incorrect or misspelled` // replace last , with 'and'
    : `Word ${mnemonicErrorFields} is incorrect or misspelled`;
}

export function getMnemonicErrorFields(
  errors: FormikErrors<FormikValues>,
  touched: FormikTouched<FormikValues>,
  values: FormikValues
): string[] {
  return Object.keys(errors)
    .filter(
      fieldNumber => fieldNumber !== undefined && touched[fieldNumber] && values[fieldNumber] !== ''
    ) // make sure field is touched and not empty
    .sort((a, b) => +a - +b) // sort numerically for display
    .map(fieldNumber => ` ${fieldNumber}`); // prepend space to space them out
}
