import { TextInputField } from './text-input-field';

interface RecipientFieldProps {}
export function RecipientField({}: RecipientFieldProps) {
  return <TextInputField name="recipient" label="To" placeholder="Address or name" />;
}
