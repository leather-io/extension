import { ChainID } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { c32addressDecode } from 'c32check';

import { STX_DECIMALS } from '@leather.io/constants';
import type { NetworkConfiguration } from '@leather.io/models';
import { initBigNumber, microStxToStx } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { isValidUrl } from '@shared/utils/validate-url';

import { abbreviateNumber } from '@app/common/utils';

import { convertUnicodeToAscii } from './string-utils';

export const stacksValue = ({
  value,
  fixedDecimals = true,
  withTicker = true,
  abbreviate = false,
}: {
  value: number | string | BigNumber;
  fixedDecimals?: boolean;
  withTicker?: boolean;
  abbreviate?: boolean;
}) => {
  const stacks = microStxToStx(value);
  const stxAmount = stacks.toNumber();
  return `${
    abbreviate && stxAmount > 10000
      ? abbreviateNumber(stxAmount)
      : stxAmount.toLocaleString('en-US', {
          maximumFractionDigits: fixedDecimals ? STX_DECIMALS : 3,
        })
  }${withTicker ? ' STX' : ''}`;
};

export const ftDecimals = (value: number | string | BigNumber, decimals: number) => {
  const amount = initBigNumber(value);
  return amount
    .shiftedBy(-decimals)
    .toNumber()
    .toLocaleString('en-US', { maximumFractionDigits: decimals });
};

export const ftUnshiftDecimals = (value: number | string | BigNumber, decimals: number) => {
  const amount = initBigNumber(value);
  return amount.shiftedBy(decimals).toString(10);
};

export const validateStacksAddress = (stacksAddress: string): boolean => {
  try {
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};

export function validateAddressChain(address: string, currentNetwork: NetworkConfiguration) {
  const prefix = address.slice(0, 2);
  switch (currentNetwork.chain.stacks.chainId) {
    case ChainID.Mainnet:
      return prefix === 'SM' || prefix === 'SP';
    case ChainID.Testnet:
      return prefix === 'SN' || prefix === 'ST';
    default:
      return false;
  }
}

export function isFtNameLikeStx(name: string) {
  return ['stx', 'stack', 'stacks'].includes(convertUnicodeToAscii(name).toLocaleLowerCase());
}

export function getSafeImageCanonicalUri(imageCanonicalUri: string, name: string) {
  return imageCanonicalUri && isValidUrl(imageCanonicalUri) && !isFtNameLikeStx(name)
    ? imageCanonicalUri
    : '';
}

/**
 * Gets the contract name of a fully qualified name of an asset.
 *
 * @param contractId - the source string: [principal].[contract-name] or [principal].[contract-name]::[asset-name]
 */
export const getStacksContractName = (contractId: string): string => {
  if (contractId.includes('.')) {
    const parts = contractId?.split('.');
    if (contractId.includes('::')) {
      return parts[1].split('::')[0];
    }
    return parts[1];
  }
  logger.warn(
    'getStacksContractName: does not contain a period, does not appear to be a contractId.',
    contractId
  );
  return contractId;
};

/**
 * Gets the asset name from a a fully qualified name of an asset.
 *
 * @param contractId - the fully qualified name of the asset: [principal].[contract-name]::[asset-name]
 */
const getStacksContractAssetName = (contractId: string): string => {
  if (!contractId.includes('::')) {
    logger.warn(
      'getStacksContractAssetName: does not contain "::", does not appear to be a fully qualified name of an asset.',
      contractId
    );
    return contractId;
  }
  return contractId.split('::')[1];
};

/**
 * Gets the parts that make up a fully qualified name of an asset.
 *
 * @param contractId - the fully qualified name of the asset: [principal].[contract-name]::[asset-name]
 */
export const getStacksContractIdStringParts = (
  contractId: string
): {
  contractAddress: string;
  contractAssetName: string;
  contractName: string;
} => {
  if (!contractId.includes('.') || !contractId.includes('::')) {
    logger.warn(
      'getStacksContractIdStringParts: does not contain a period or "::", does not appear to be a fully qualified name of an asset.',
      contractId
    );
    return {
      contractAddress: contractId,
      contractAssetName: contractId,
      contractName: contractId,
    };
  }

  const contractAddress = contractId.split('.')[0];
  const contractAssetName = getStacksContractAssetName(contractId);
  const contractName = getStacksContractName(contractId);

  return {
    contractAddress,
    contractAssetName,
    contractName,
  };
};
