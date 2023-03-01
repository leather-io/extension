export function json(arg: unknown) {
  return {
    body: JSON.stringify(arg),
    contentType: 'application/json',
  };
}
