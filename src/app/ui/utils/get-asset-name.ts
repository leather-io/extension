/**
 * getAssetName
 *
 * Gets the asset name from a string.
 *
 * @param fullyQualifiedName - the fully qualified name of the asset: [principal].[contract-name]::[asset-name]
 */
export const getAssetName = (fullyQualifiedName: string): string => {
  if (!fullyQualifiedName.includes('::')) {
    // console.warn(
    //   'getAssetName: does not contain "::", does not appear to be a fully qualified name of an asset.',
    //   {
    //     fullyQualifiedName,
    //   }
    // );
    return fullyQualifiedName;
  }
  return fullyQualifiedName.split('::')[1];
};

// get rebasing this then get to work on the next list
