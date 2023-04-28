function fibonacci(n = 0): number {
  if (n < 0) throw 'Cannot calculate from negative number';
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function* fibonacciGenerator(startIndex = 0): IterableIterator<number> {
  let index = startIndex;
  while (index < Infinity) yield fibonacci(index++);
  return Infinity;
}
