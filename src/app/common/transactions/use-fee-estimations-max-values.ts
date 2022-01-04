import {
  useConfigFeeEstimationsEnabled,
  useConfigFeeEstimationsMaxValues,
} from '@app/query/hiro-config/hiro-config.query';

const defaultFeeEstimationsMaxValues = [500000, 750000, 2000000];

export function useFeeEstimationsMaxValues() {
  // Get it first from the config
  const configFeeEstimationsEnabled = useConfigFeeEstimationsEnabled();
  const configFeeEstimationsMaxValues = useConfigFeeEstimationsMaxValues();
  // Only when the remote config file explicitly sets the maxValuesEnabled as false, we return no cap for fees
  if (configFeeEstimationsEnabled === false) return;
  return configFeeEstimationsMaxValues || defaultFeeEstimationsMaxValues;
}
