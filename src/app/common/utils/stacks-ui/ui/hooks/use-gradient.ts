import {
  generateHash,
  getAssetStringParts,
  hashValue,
  moduloRange,
  stringToHslColor,
} from '@app/common/utils/stacks-ui/ui/colors';

export const defaults = {
  lightness: 55,
  saturation: 65,
  gradientStop1: 0,
  saturationFactor1: 1.25,
  lightnessFactor1: 1.4,
  gradientStop2: 60,
  saturationFactor2: 1.2,
  lightnessFactor2: 0.9,
  gradientStop3: 100,
  saturationFactor3: 1,
  lightnessFactor3: 1,
};

export const useGradients = () => {
  const {
    lightness,
    saturation,
    lightnessFactor1,
    lightnessFactor2,
    saturationFactor1,
    saturationFactor2,
    gradientStop1,
    gradientStop2,
    gradientStop3,
    lightnessFactor3,
    saturationFactor3,
  } = defaults;
  const generateGradientType = (string: string) => {
    const gradientType = `${hashValue(string, ['linear', 'radial'])}-gradient`;
    const radialModifier = `${hashValue(string, [
      'farthest-side',
      'farthest-side',
      'farthest-side',
      'farthest-side',
      'farthest-side',
      'farthest-side',
      'farthest-side',
      'farthest-corner',
      'farthest-corner',
      'farthest-corner',
      'farthest-corner',
      'farthest-corner',
      'circle',
      'circle',
      'circle',
      'circle',
      'circle',
      'circle',
      'closest-side',
      'closest-side',
      'closest-corner',
      'closest-corner',
      'closest-corner',
      'closest-corner',
      'ellipse',
      'ellipse',
      'ellipse',
      'ellipse',
      'ellipse',
      'ellipse',
    ])} at ${Math.abs(moduloRange(generateHash(string), [0, 100], true))}%`;
    const linearModifier = `${Math.abs(generateHash(string) % 360)}deg`;

    const modifier = gradientType === 'linear-gradient' ? linearModifier : radialModifier;
    return `${gradientType}(${modifier}`;
  };

  const generateThreeColors = (first: string, second: string, third: string) => {
    const firstColor = stringToHslColor(
      `${first}`,
      saturation * saturationFactor1,
      lightness * lightnessFactor1
    );
    const secondColor = stringToHslColor(
      `${second}`,
      saturation * saturationFactor2,
      lightness * lightnessFactor2
    );

    const thirdColor = stringToHslColor(
      `${third}`,
      saturation * saturationFactor3,
      lightness * lightnessFactor3
    );

    return [firstColor, secondColor, thirdColor];
  };

  const assetToGradient = (string: string) => {
    const { address, assetName } = getAssetStringParts(string);
    const [addressColor, assetColor, fullyRealizedColor] = generateThreeColors(
      address,
      assetName,
      string
    );
    const gradientStart = generateGradientType(string);
    return `${gradientStart}, ${addressColor} ${gradientStop1}%, ${assetColor} ${gradientStop2}%, ${fullyRealizedColor} ${gradientStop3}%)`;
  };

  const idToGradient = (string: string) => {
    const firstWord = string.split('.')[0];
    const [color1, color2, color3] = generateThreeColors(firstWord, firstWord, string);
    const gradientStart = generateGradientType(string);
    return `${gradientStart}, ${color1} ${gradientStop1}%, ${color2} ${gradientStop2}%, ${color3} ${gradientStop3}%)`;
  };

  const singleStringToColor = (string: string) => {
    const color = stringToHslColor(string, saturation, lightness);
    return `linear-gradient(0deg, ${color} 0%, ${color} 100%)`;
  };

  const getGradient = (string: string) => {
    const isAssetId = string.includes('.') && string.includes('::');
    const isSomeId = !isAssetId && string.includes('.'); // contract ID or user ID

    if (isAssetId) {
      return assetToGradient(string);
    }
    if (isSomeId) {
      return idToGradient(string);
    }
    return singleStringToColor(string);
  };

  return {
    getGradient,
    singleStringToColor,
    idToGradient,
    assetToGradient,
    generateGradientType,
  };
};
