export function groupByFour(text: string) {
  const result = [];
  for (let i = 0; i < text.length; i += 4) {
    result.push(text.slice(i, i + 4));
  }
  return result;
}
