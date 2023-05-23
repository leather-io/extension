export function createCounter(startPosition = 0) {
  let count = startPosition;
  return {
    getValue() {
      return count;
    },
    increment() {
      return (count += 1);
    },
    incrementBy(amount: number) {
      return (count += amount);
    },
    decrement() {
      return (count -= 1);
    },
  };
}
