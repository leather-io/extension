import { TextInputField } from './text-input-field';

interface MemoFieldProps {}
export function MemoField({}: MemoFieldProps) {
  return <TextInputField name="memo" label="Memo" placeholder="Optional message" />;
}
