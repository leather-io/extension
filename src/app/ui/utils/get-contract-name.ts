/**
 * getContractName
 *
 * Gets the contract name of a string: contract_id or fully qualified asset name.
 *
 * @param value - the source string: [principal].[contract-name] or [principal].[contract-name]::[asset-name]
 */
export const getContractName = (value: string): string => {
  if (value.includes('.')) {
    const parts = value?.split('.');
    if (value.includes('::')) {
      return parts[1].split('::')[0];
    }
    return parts[1];
  }
  // #4476 TODO: migrate to log in Sentry
  //   console.warn('getContractName: does not contain a period, does not appear to be a contract_id.', {
  //     value,
  //   });
  return value;
};
