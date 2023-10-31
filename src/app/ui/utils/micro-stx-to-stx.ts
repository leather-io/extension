export function microStxToStx(microStx: string | number): number | string {
  return Number(Number(microStx) / Math.pow(10, 6));
}
