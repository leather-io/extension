export function pxStringToNumber(pxString: string): number {
  return +pxString.replace('px', '');
}
