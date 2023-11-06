// NOTE: These functions only get used in useAccountGradient so could be relocated there
// we need to analyse the ColorsStringLiteral also and determine what we need from it

// Original ColorsStringLiteral below
export declare type ColorsStringLiteral =
  | 'accent'
  | 'brand'
  | 'bg'
  | 'bg-2'
  | 'bg-3'
  | 'bg-4'
  | 'bg-alt'
  | 'bg-light'
  | 'invert'
  | 'text-hover'
  | 'text-title'
  | 'text-caption'
  | 'text-body'
  | 'icon'
  | 'input-placeholder'
  | 'border'
  | 'feedback-alert'
  | 'feedback-error'
  | 'feedback-success';

/**
 * generateHash
 * @param str - The string to hash
 */

export function generateHash(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return hash;
}

/**
 * Get value from the provided `options` based on the hash of `str`.
 *
 * @param str - The string to hash
 * @param options - array of options to get value from
 */

export function hashValue<T>(str: string, options: T[]): T {
  let hash = generateHash(str);
  hash = ((hash % options.length) + options.length) % options.length;
  return options[hash];
}

/**
 * stringToHslColor
 *
 * @param str - The string to hash
 * @param saturation - saturation of result color (0 - 100)
 * @param lightness - lightness of result color (0 - 100)
 */
export function stringToHslColor(str: string, saturation: number, lightness: number): string {
  const hash = generateHash(str);
  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function moduloRange(x: number, range: [number, number], includeMax = false): number {
  const max = range[1],
    min = range[0],
    d = max - min;
  return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
}

// #4383 migrate / remove this
export const color = (name: ColorsStringLiteral): string => `var(--colors-${name})`;
