import { useMemo } from 'react';

import { generateHash, hashValue, moduloRange, stringToHslColor } from '@stacks/ui-utils';
import chroma from 'chroma-js';

function generateGradientType(string: string) {
  const gradientType = `${hashValue(string, ['linear', 'radial'])}-gradient`;
  const isLinear = gradientType === 'linear-gradient';

  if (!isLinear) {
    const radialModifier = `${hashValue(string, [
      'farthest-side',
      'farthest-corner',
      'circle',
      'closest-side',
      'closest-corner',
      'ellipse',
    ])} at ${Math.abs(moduloRange(generateHash(string), [isLinear ? 0 : 50, 100], true))}%`;
    return `${gradientType}(${radialModifier}`;
  } else {
    const linearModifier = `${Math.abs(generateHash(string) % 360)}deg`;
    return `${gradientType}(${linearModifier}`;
  }
}

export function useAccountGradient(publicKey: string) {
  return useMemo(() => {
    const keyLength = publicKey.length;
    const part1 = publicKey.substring(0, keyLength / 2);
    const part2 = publicKey.substring(keyLength / 2, keyLength);

    const bg = stringToHslColor(part1, 50, 60);
    let bg2 = stringToHslColor(part2, 50, 60);
    const bg3 = stringToHslColor(part2 + '__' + part1, 50, 60);

    const contrast = chroma.contrast(bg, bg2);

    if (contrast < 1.15) {
      bg2 = chroma(bg2).darken(1.25).hex();
    }

    const gradientTypeString = part1 + '__' + part2;
    const gradientType = generateGradientType(gradientTypeString);

    return `${gradientType}, ${bg3} 0%, ${bg2} 70%, ${bg} 100%)`;
  }, [publicKey]);
}
