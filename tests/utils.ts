export function json(arg: unknown) {
  return {
    body: JSON.stringify(arg),
    contentType: 'application/json',
  };
}

export const wait = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
