export function createCounter(startPosition: number = 0) {
  let count = startPosition;
  return {
    getValue() {
      return count;
    },
    increment() {
      return (count += 1);
    },
    decrement() {
      return (count -= 1);
    },
  };
}
