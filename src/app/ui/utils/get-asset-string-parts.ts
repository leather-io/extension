import { getAssetName } from './get-asset-name';
import { getContractName } from './get-contract-name';

/**
 * getAssetStringParts
 *
 * Gets the parts that make up a fully qualified name of an asset
 *
 * @param fullyQualifiedName - the fully qualified name of the asset: [principal].[contract-name]::[asset-name]
 */
export const getAssetStringParts = (
  fullyQualifiedName: string
): {
  address: string;
  contractName: string;
  assetName: string;
} => {
  if (!fullyQualifiedName.includes('.') || !fullyQualifiedName.includes('::')) {
    // console.warn(
    //   'getAssetStringParts: does not contain a period or "::", does not appear to be a fully qualified name of an asset.',
    //   {
    //     fullyQualifiedName,
    //   }
    // );
    return {
      address: fullyQualifiedName,
      contractName: fullyQualifiedName,
      assetName: fullyQualifiedName,
    };
  }

  const address = fullyQualifiedName.split('.')[0];
  const contractName = getContractName(fullyQualifiedName);
  const assetName = getAssetName(fullyQualifiedName);

  return {
    address,
    contractName,
    assetName,
  };
};
