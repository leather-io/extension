import { abbreviateNumber, isUndefined } from '@app/common/utils';
import { AssetWithMeta, FtMeta } from './asset-types';
import { convertUnicodeToAscii } from './string-utils';
import { isValidUrl } from './validation/validate-url';

export function removeCommas(amountWithCommas: string) {
  return amountWithCommas.replace(/,/g, '');
}

export function getFormattedAmount(amount: string) {
  const noCommas = removeCommas(amount);
  const number = noCommas.includes('.') ? parseFloat(noCommas) : parseInt(noCommas);
  return number > 10000
    ? {
        isAbbreviated: true,
        value: abbreviateNumber(number),
      }
    : { value: amount, isAbbreviated: false };
}

export const isIconUrl = isValidUrl;

export function isFtNameLikeStx(name: string) {
  return ['stx', 'stack', 'stacks'].includes(convertUnicodeToAscii(name).toLocaleLowerCase());
}

export function imageCanonicalUriFromFtMetadata(meta: FtMeta | undefined) {
  return meta?.image_canonical_uri &&
    isIconUrl(meta.image_canonical_uri) &&
    !isFtNameLikeStx(meta.image_canonical_uri)
    ? meta.image_canonical_uri
    : undefined;
}

export function gradientStringForAsset(asset: AssetWithMeta): string {
  return `${asset?.contractAddress}.${asset?.contractName}::${asset?.name}`;
}

export function iconStringForAsset(asset: AssetWithMeta | undefined): string {
  if (isUndefined(asset)) return 'STX';
  const imageUri = imageCanonicalUriFromFtMetadata(asset.meta);
  if (imageUri) return imageUri;
  return gradientStringForAsset(asset);
}
