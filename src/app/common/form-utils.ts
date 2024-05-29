import { useField, useFormikContext } from 'formik';

// FIXME load this from UI utils. Maybe even @leather/utils?
// should refactor other components to UI lib maybe?
export function useIsFieldDirty(name: string) {
  const [field, meta] = useField(name);
  return field.value !== meta.initialValue;
}

export function useShowFieldError(name: string) {
  const form = useFormikContext();
  const [_, meta] = useField(name);
  const isDirty = useIsFieldDirty(name);
  const isFieldInFocus = document.activeElement?.getAttribute('name') === name;

  return !!(
    (form.submitCount > 0 && meta.error) ||
    (!isFieldInFocus && meta.touched && isDirty && meta.error)
  );
}
