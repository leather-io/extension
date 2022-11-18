import { TextInputField } from './text-input-field';

interface MemoFieldProps {
  lastChild?: boolean;
}
export function MemoField({}: MemoFieldProps) {
  return <TextInputField name="memo" label="Memo" lastChild placeholder="Optional message" />;
}
