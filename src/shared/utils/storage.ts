export function setToLocalstorageIfDefined(storageKey: string, value?: string) {
  if (value) {
    localStorage.setItem(storageKey, value);
  }
}
