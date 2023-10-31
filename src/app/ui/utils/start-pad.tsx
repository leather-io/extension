export const startPad = (n: number, z = 2, s = '0') =>
  (n + '').length <= z ? ['', '-'][+(n < 0)] + (s.repeat(z) + Math.abs(n)).slice(-1 * z) : n + '';
